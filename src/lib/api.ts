import { createServerFn } from '@tanstack/react-start'
import type { House } from './types'

const withImageUrl = (house: House): House => ({
  ...house,
  image: `${process.env.API_URL}${house.image}`,
})

export const getHouses = createServerFn({ method: 'GET' }).handler(
  async (): Promise<House[]> => {
    const res = await fetch(`${process.env.API_URL}/api/houses`)
    if (!res.ok) throw new Error('Error al cargar las casas')
    const houses: House[] = await res.json()
    return houses.map(withImageUrl)
  },
)

export const getHouse = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }): Promise<House | null> => {
    const res = await fetch(`${process.env.API_URL}/api/houses/${id}`)
    if (!res.ok) return null
    const text = await res.text()
    return text ? withImageUrl(JSON.parse(text)) : null
  })