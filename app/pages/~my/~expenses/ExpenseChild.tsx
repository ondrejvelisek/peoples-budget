import { Link } from "@tanstack/react-router";
import { findByName, type ExpenseItem } from "../../../data/expenses";

export default function ExpenseChild({ name }: { name: string }) {
  const expense: ExpenseItem | null = findByName(name);
  if (!expense) {
    return <div>Not found</div>;
  }

  return (
    <li className="">
      <Link to="/my/expenses/$expenseName" params={{ expenseName: name }}>
        {expense.title}
      </Link>
    </li>
  );
}
