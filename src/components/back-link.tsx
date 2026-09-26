import { Link } from '@tanstack/react-router'

export function BackLink() {
  return (
    <Link
      to="/"
      className="mb-6 inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline"
    >
      Volver al listado
    </Link>
  )
}