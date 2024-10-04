import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/support/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-4">
      <h1>Podpořit projekt</h1>
    </div>
  )
}
