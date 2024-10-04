import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/2024/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-4">
      <h1>Vládní rozpočet 2024</h1>
    </div>
  )
}
