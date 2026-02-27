import { createFileRoute } from '@tanstack/react-router'
import { SignInForm } from './-components/form'
import { JSX } from 'react'

export const Route = createFileRoute('/_auth/sign-in/')({
  component: RouteComponent,
})

function RouteComponent(): JSX.Element {
  return <SignInForm />
}
