import { createFileRoute } from '@tanstack/react-router'
import { SignUpForm } from './-components/form'
import { JSX } from 'react'

export const Route = createFileRoute('/_auth/sign-up/')({
  component: RouteComponent,
})

function RouteComponent(): JSX.Element {
  return <SignUpForm />
}
