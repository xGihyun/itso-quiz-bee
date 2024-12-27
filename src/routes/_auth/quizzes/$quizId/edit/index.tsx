import { createFileRoute, redirect } from '@tanstack/react-router'
import { EditQuizForm } from './-components/edit-quiz-form'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { getQuiz } from '@/lib/quiz/requests'
import { JSX } from 'react'

export const Route = createFileRoute('/_auth/quizzes/$quizId/edit/')({
  component: RouteComponent,
})

function RouteComponent(): JSX.Element {
  const params = Route.useParams()
  const query = useQuery({
    queryKey: ['quiz', params.quizId],
    queryFn: () => getQuiz(params.quizId),
  })

  if (query.isPending) {
    return <Skeleton className="w-20 h-20" />
  }

  if (query.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{query.data?.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <EditQuizForm quiz={query.data.data} />
    </div>
  )
}
