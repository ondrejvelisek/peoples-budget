import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/2025/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-4">
      <h1>Návrh vládního rozpočtu 2025</h1>
    </div>
  )
}
