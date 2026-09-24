import { Link, createFileRoute } from '@tanstack/react-router'
import { getHouses } from '#/lib/api'

export const Route = createFileRoute('/')({
  loader: () => getHouses(),
  component: HomePage,
})

function HomePage() {
  const houses = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="mb-10 text-4xl font-semibold">Casas Rurales</h1>

      <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {houses.map((house) => (
          <li key={house.id}>
            <Link
              to="/houses/$id"
              params={{ id: house.id }}
              className="group block"
            >
              <h2 className="mb-2 text-xl font-medium group-hover:underline">
                {house.name}
              </h2>
              <img
                src={house.image}
                alt={house.name}
                className="aspect-4/3 w-full rounded object-cover"
              />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}