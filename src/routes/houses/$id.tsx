import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { getHouse } from '#/lib/api'

export const Route = createFileRoute('/houses/$id')({
  loader: async ({ params }) => {
    const house = await getHouse({ data: params.id })
    if (!house) throw notFound()
    return house
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
  }),
  component: HouseDetailPage,
  notFoundComponent: () => (
    <main className="mx-auto max-w-5xl p-8">
      <p className="mb-4 text-2xl">Esta casa no existe.</p>
      <Link to="/" className="hover:underline">
        ← Volver al listado
      </Link>
    </main>
  ),
})

function HouseDetailPage() {
  const house = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-5xl p-8">
      <Link to="/" className="mb-6 inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline">
        Volver al listado
      </Link>

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

        <div className="space-y-5">
          <div>
            <h2 className="font-semibold">Descripción</h2>
            <p>{house.description}</p>
          </div>

          <div>
            <h2 className="font-semibold">Dirección</h2>
            <p>
              {house.address}, {house.city}, {house.country}
            </p>
          </div>

          <ul className="space-y-2">
            <li>
              <strong>Habitaciones</strong>: {house.bedrooms}
            </li>
            <li>
              <strong>Camas</strong>: {house.beds}
            </li>
            <li>
              <strong>Baños</strong>: {house.bathrooms}
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl">Reviews</h2>
        <ul className="space-y-4">
          {house.reviews.map((review) => (
            <li key={review.id} className="rounded-lg border-2 p-4">
              <p className="mb-2">Fecha: {review.date}</p>
              <p>
                {review.author}: {review.comment}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}