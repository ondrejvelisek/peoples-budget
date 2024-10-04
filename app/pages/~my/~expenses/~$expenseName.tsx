import { createFileRoute } from '@tanstack/react-router'
import Expense from './Expense'

export const Route = createFileRoute('/my/expenses/$expenseName')({
  component: ExpensePage,
})

function ExpensePage() {
  const { expenseName } = Route.useParams()
  return (
    <div className="p-2">
      <Expense name={expenseName} />
    </div>
  )
}
