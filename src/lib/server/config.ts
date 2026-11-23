function numberFromEnv(name: string, fallback: number) {
  const value = Number(process.env[name])
  return Number.isFinite(value) && value > 0 ? value : fallback
}

/** Cupo máximo de colaboradores aceptados. */
export function joinCapacity() {
  return Math.floor(numberFromEnv('JOIN_CAPACITY', 35))
}

/** Pesos mexicanos que equivalen a 1 kg de croqueta en el contador. */
export function mxnPerKg() {
  return numberFromEnv('DONATION_MXN_PER_KG', 20)
}

export function moneyToKg(amount: number) {
  return Math.round((amount / mxnPerKg()) * 1000) / 1000
}

export interface EventInfo {
  date: string
  details: string
  location: string
  name: string
  time: string
}

export function eventInfo(): EventInfo {
  return {
    date: process.env.EVENT_DATE?.trim() || 'Por confirmar',
    details: process.env.EVENT_DETAILS?.trim() || '',
    location: process.env.EVENT_LOCATION?.trim() || 'Por confirmar',
    name: process.env.EVENT_NAME?.trim() || 'Croquetón 2026',
    time: process.env.EVENT_TIME?.trim() || 'Por confirmar'
  }
}
