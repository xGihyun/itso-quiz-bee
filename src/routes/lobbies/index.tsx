import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lobbies/')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /lobbies/!'
}
