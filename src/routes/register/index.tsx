import { createFileRoute } from '@tanstack/react-router'
import { RegisterForm } from './-components/form';

export const Route = createFileRoute('/register/')({
  component: RouteComponent,
})

function RouteComponent(): JSX.Element {
  return (
    <div>
      <RegisterForm />
    </div>
  );
}
