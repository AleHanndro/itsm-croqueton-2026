import { joinCapacity, mxnPerKg, type EventInfo } from '@/lib/server/config'

const colors = {
  accent: '#f15b3e',
  brand: '#ffc929',
  cream: '#fff8df',
  ink: '#202436',
  secondary: '#72bbba'
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

const numberFormat = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 3 })
const moneyFormat = new Intl.NumberFormat('es-MX', {
  currency: 'MXN',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
  style: 'currency'
})

function siteUrl() {
  return process.env.SITE_URL?.replace(/\/$/, '') || ''
}

/** Envoltura común: encabezado amarillo, tarjeta blanca y pie con el nombre del evento. */
function layout({
  body,
  event,
  preheader,
  title
}: {
  body: string
  event: EventInfo
  preheader: string
  title: string
}) {
  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${colors.cream};font-family:Arial,Helvetica,sans-serif;color:${colors.ink};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.cream};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:3px solid ${colors.ink};border-radius:20px;overflow:hidden;">
<tr><td style="background:${colors.brand};padding:22px 28px;border-bottom:3px solid ${colors.ink};">
<p style="margin:0;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">🐾 ${escapeHtml(event.name)}</p>
<h1 style="margin:8px 0 0;font-size:26px;line-height:1.15;">${escapeHtml(title)}</h1>
</td></tr>
<tr><td style="padding:26px 28px;font-size:16px;line-height:1.55;">${body}</td></tr>
<tr><td style="padding:16px 28px;background:${colors.ink};color:#ffffff;font-size:12px;line-height:1.5;">
Recibiste este correo porque te registraste o donaste en ${escapeHtml(event.name)}.${siteUrl() ? ` <a href="${siteUrl()}" style="color:${colors.brand};">Visita el sitio</a>.` : ''}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

function eventDetailsHtml(event: EventInfo) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;font-weight:bold;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:18px 0;padding:14px 16px;background:${colors.cream};border:2px solid ${colors.ink};border-radius:14px;">
${row('📅 Fecha', event.date)}
${row('⏰ Hora', event.time)}
${row('📍 Lugar', event.location)}
${event.details ? row('📝 Indicaciones', event.details) : ''}
</table>`
}

function eventDetailsText(event: EventInfo) {
  return [
    `Fecha: ${event.date}`,
    `Hora: ${event.time}`,
    `Lugar: ${event.location}`,
    event.details ? `Indicaciones: ${event.details}` : ''
  ]
    .filter(Boolean)
    .join('\n')
}

export function joinAcceptedEmail({ event, name }: { event: EventInfo; name: string }) {
  const subject = `¡Ya eres parte de la manada de ${event.name}! 🐶`
  const safeName = escapeHtml(name)

  const html = layout({
    event,
    body: `<p style="margin:0 0 14px;">¡Hola, <strong>${safeName}</strong>!</p>
<p style="margin:0 0 14px;">Tu solicitud fue <strong style="color:${colors.secondary};">aceptada</strong>: ya tienes uno de los ${joinCapacity()} lugares como colaborador de ${escapeHtml(event.name)}. Gracias por regalar tu tiempo para llenar platos y mover colitas.</p>
<p style="margin:0;font-weight:bold;">Esto es lo que necesitas saber del evento:</p>
${eventDetailsHtml(event)}
<p style="margin:0 0 14px;">Si al final no puedes asistir, responde a este correo para liberar tu lugar y dárselo a alguien de la lista de espera.</p>
<p style="margin:0;">¡Nos vemos pronto!<br><strong>La manada del Croquetón</strong></p>`,
    preheader: `Tu lugar como colaborador está confirmado. Fecha: ${event.date}.`,
    title: '¡Bienvenido a la manada!'
  })

  const text = `¡Hola, ${name}!

Tu solicitud fue aceptada: ya tienes uno de los ${joinCapacity()} lugares como colaborador de ${event.name}. Gracias por regalar tu tiempo.

Información del evento:
${eventDetailsText(event)}

Si al final no puedes asistir, responde a este correo para liberar tu lugar.

¡Nos vemos pronto!
La manada del Croquetón`

  return { html, subject, text }
}

export function joinWaitlistedEmail({ event, name }: { event: EventInfo; name: string }) {
  const subject = `Gracias por querer unirte a ${event.name} 🐾`
  const safeName = escapeHtml(name)

  const html = layout({
    event,
    body: `<p style="margin:0 0 14px;">¡Hola, <strong>${safeName}</strong>!</p>
<p style="margin:0 0 14px;">Muchas gracias por querer ser parte de ${escapeHtml(event.name)}. Nos llena el corazón (y la pancita de los perritos) ver a tanta gente con ganas de ayudar.</p>
<p style="margin:0 0 14px;">Por ahora ya se ocuparon los <strong>${joinCapacity()} lugares</strong> para colaboradores, así que no fue posible sumarte en este momento.</p>
<p style="margin:0 0 14px;padding:14px 16px;background:${colors.cream};border-left:5px solid ${colors.accent};border-radius:10px;">Te dejamos en la <strong>lista de espera</strong>: si se libera un lugar, te escribiremos a este mismo correo con toda la información del evento.</p>
<p style="margin:0 0 14px;">Mientras tanto, también puedes ayudar donando croquetas o compartiendo la campaña.</p>
<p style="margin:0;">Con cariño,<br><strong>La manada del Croquetón</strong></p>`,
    preheader: 'Los lugares están llenos, pero quedaste en lista de espera.',
    title: '¡Gracias por tu interés!'
  })

  const text = `¡Hola, ${name}!

Muchas gracias por querer ser parte de ${event.name}.

Por ahora ya se ocuparon los ${joinCapacity()} lugares para colaboradores, así que no fue posible sumarte en este momento. Quedaste en la lista de espera: si se libera un lugar, te escribiremos a este mismo correo con toda la información del evento.

Mientras tanto, también puedes ayudar donando croquetas o compartiendo la campaña.

Con cariño,
La manada del Croquetón`

  return { html, subject, text }
}

export interface DonationSummary {
  croquetteAmount: number
  croquetteUnit: 'g' | 'kg'
  firstName: string
  items: { name: string; quantity: number; unit: string | null }[]
  moneyAmount: number
  moneyKg: number
}

/** Frases tipo "5 kg de croqueta", "$200 MXN (equivalen a 10 kg de croqueta)", "3 Juguetes". */
export function describeDonation(summary: DonationSummary) {
  const parts: string[] = []
  if (summary.croquetteAmount > 0) {
    parts.push(
      `${numberFormat.format(summary.croquetteAmount)} ${summary.croquetteUnit} de croqueta`
    )
  }
  if (summary.moneyAmount > 0) {
    parts.push(
      `${moneyFormat.format(summary.moneyAmount)} MXN (equivalen a ${numberFormat.format(summary.moneyKg)} kg de croqueta)`
    )
  }
  for (const item of summary.items) {
    // "3 juguetes" o, si trae unidad de medida, "2 kg de sobres de alimento".
    const unit =
      item.unit && !['unidad', 'unidades', 'pieza', 'piezas'].includes(item.unit)
        ? ` ${item.unit} de`
        : ''
    parts.push(`${numberFormat.format(item.quantity)}${unit} ${item.name}`)
  }
  return parts
}

function joinList(parts: string[]) {
  if (parts.length <= 1) return parts[0] ?? 'tu donativo'
  return `${parts.slice(0, -1).join(', ')} y ${parts.at(-1)}`
}

export function donationThanksEmail(summary: DonationSummary, event: EventInfo) {
  const parts = describeDonation(summary)
  const headline = joinList(parts)
  const totalKg =
    (summary.croquetteUnit === 'g' ? summary.croquetteAmount / 1000 : summary.croquetteAmount) +
    summary.moneyKg
  const subject = `¡Gracias por tu donación a ${event.name}! 🦴`
  const safeName = escapeHtml(summary.firstName)

  const html = layout({
    event,
    body: `<p style="margin:0 0 14px;">¡Hola, <strong>${safeName}</strong>!</p>
<p style="margin:0 0 14px;font-size:18px;">Gracias por haber donado <strong>${escapeHtml(headline)}</strong>.</p>
${
  parts.length > 1
    ? `<ul style="margin:0 0 14px;padding-left:20px;">${parts.map((part) => `<li style="margin:4px 0;">${escapeHtml(part)}</li>`).join('')}</ul>`
    : ''
}
${
  totalKg > 0
    ? `<p style="margin:0 0 14px;padding:14px 16px;background:${colors.brand};border:2px solid ${colors.ink};border-radius:14px;font-weight:bold;">Tu aporte suma ${numberFormat.format(totalKg)} kg al contador de la meta.${summary.moneyAmount > 0 ? ` <span style="font-weight:normal;">(Cada ${moneyFormat.format(mxnPerKg())} MXN cuentan como 1 kg de croqueta).</span>` : ''}</p>`
    : ''
}
<p style="margin:0 0 14px;">Gracias a personas como tú, muchos perritos van a tener la pancita llena. Cada croqueta cuenta. 🐶💛</p>
<p style="margin:0;">Con mucho cariño,<br><strong>La manada del Croquetón</strong></p>`,
    preheader: `Gracias por haber donado ${headline}.`,
    title: '¡Gracias por donar!'
  })

  const text = `¡Hola, ${summary.firstName}!

Gracias por haber donado ${headline}.
${parts.length > 1 ? `\n${parts.map((part) => `- ${part}`).join('\n')}\n` : ''}${
    totalKg > 0
      ? `\nTu aporte suma ${numberFormat.format(totalKg)} kg al contador de la meta.${summary.moneyAmount > 0 ? ` (Cada ${moneyFormat.format(mxnPerKg())} MXN cuentan como 1 kg de croqueta).` : ''}\n`
      : ''
  }
Gracias a personas como tú, muchos perritos van a tener la pancita llena.

Con mucho cariño,
La manada del Croquetón`

  return { html, subject, text }
}
