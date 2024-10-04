import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/published/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-4">
      <h1>Zveřejněné rozpočty občanů</h1>
    </div>
  )
}
