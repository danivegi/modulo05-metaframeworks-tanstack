import { createServerFn } from '@tanstack/react-start'
import { getHouse } from './api'

export interface BookingState {
  ok: boolean
  message: string
}

const DAY_MS = 1000 * 60 * 60 * 24

export const bookHouse = createServerFn({ method: 'POST' })
  .validator((data: FormData) => ({
    houseId: String(data.get('houseId')),
    checkIn: String(data.get('checkIn')),
    checkOut: String(data.get('checkOut')),
  }))
  .handler(async ({ data }): Promise<BookingState> => {
    const nights =
      (Date.parse(data.checkOut) - Date.parse(data.checkIn)) / DAY_MS
    if (!(nights > 0)) {
      return {
        ok: false,
        message: 'La fecha de salida debe ser posterior a la de entrada.',
      }
    }

    const house = await getHouse({ data: data.houseId })
    if (!house) {
      return { ok: false, message: 'La casa no existe.' }
    }

    return {
      ok: true,
      message: `¡Reserva confirmada! ${nights} noches por ${nights * house.price}€.`,
    }
  })