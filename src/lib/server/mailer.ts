import nodemailer, { type Transporter } from 'nodemailer'

import { query } from '@/lib/db'

export type EmailKind = 'donation_thanks' | 'join_accepted' | 'join_waitlisted'

export interface EmailMessage {
  html: string
  kind: EmailKind
  relatedId?: string | null
  subject: string
  text: string
  to: string
}

const globalForMailer = globalThis as unknown as { croquetonMailer?: Transporter | null }

function createTransport(): Transporter | null {
  const host = process.env.SMTP_HOST?.trim()
  if (!host) return null

  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER?.trim()

  return nodemailer.createTransport({
    auth: user ? { pass: process.env.SMTP_PASS ?? '', user } : undefined,
    host,
    port,
    // 465 usa TLS directo; 587/25 usan STARTTLS.
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465
  })
}

function getTransport() {
  if (globalForMailer.croquetonMailer === undefined) {
    globalForMailer.croquetonMailer = createTransport()
  }
  return globalForMailer.croquetonMailer
}

export function isMailerConfigured() {
  return getTransport() !== null
}

async function logEmail(
  message: EmailMessage,
  status: 'failed' | 'sent' | 'skipped',
  error?: string
) {
  try {
    await query(
      `INSERT INTO email_log (kind, recipient, subject, status, error, related_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [message.kind, message.to, message.subject, status, error ?? null, message.relatedId ?? null]
    )
  } catch (logError) {
    console.error('[mailer] could not write email_log', logError)
  }
}

/**
 * Envía un correo y lo registra en email_log. Nunca lanza: un fallo de SMTP no debe
 * tumbar la petición que lo originó (se usa dentro de `after()`).
 */
export async function sendEmail(message: EmailMessage) {
  const transport = getTransport()

  if (!transport) {
    console.warn(
      `[mailer] SMTP_HOST no configurado; correo "${message.subject}" a ${message.to} omitido`
    )
    await logEmail(message, 'skipped', 'smtp_not_configured')
    return
  }

  try {
    await transport.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      html: message.html,
      replyTo: process.env.MAIL_REPLY_TO || undefined,
      subject: message.subject,
      text: message.text,
      to: message.to
    })
    await logEmail(message, 'sent')
  } catch (error) {
    console.error(`[mailer] fallo al enviar "${message.subject}" a ${message.to}`, error)
    await logEmail(message, 'failed', error instanceof Error ? error.message : String(error))
  }
}
