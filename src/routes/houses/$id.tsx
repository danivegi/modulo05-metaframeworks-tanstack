import { createFileRoute, notFound } from '@tanstack/react-router'
import { getHouse } from '#/lib/api'
import { BackLink } from '#/components/back-link'
import { HouseInfo } from '#/components/house-info'
import { ReviewList } from '#/components/review-list'
import { BookingForm } from '#/components/booking-form'

export const Route = createFileRoute('/houses/$id')({
  loader: async ({ params }) => {
    const house = await getHouse({ data: params.id })
    if (!house) throw notFound()
    return house
  },
  headers: () => ({
    'Cache-Control':
      'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
  }),
  component: HouseDetailPage,
  notFoundComponent: HouseNotFound,
})

function HouseDetailPage() {
  const house = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-5xl p-8">
      <BackLink />

      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-semibold">{house.name}</h1>
        <p className="text-3xl">{house.price}€ / noche</p>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        <img
          src={house.image}
          alt={house.name}
          className="aspect-4/3 w-full rounded object-cover"
        />
        <HouseInfo house={house} />
      </section>

      <BookingForm houseId={house.id} />
      <ReviewList reviews={house.reviews} />
    </main>
  )
}

function HouseNotFound() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <p className="mb-4 text-2xl">Esta casa no existe.</p>
      <BackLink />
    </main>
  )
}