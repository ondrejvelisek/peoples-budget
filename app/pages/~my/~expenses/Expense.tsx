import { Link } from "@tanstack/react-router";
import {
  findByName,
  findParent,
  type ExpenseItem,
} from "../../../data/expenses";
import ExpenseChild from "./ExpenseChild";

export default function Expense({ name }: { name: string }) {
  const expense: ExpenseItem | undefined = findByName(name);
  if (!expense) {
    return <div>Not found</div>;
  }

  const parent = findParent(name);

  if ("children" in expense) {
    return (
      <div className="">
        {parent && (
          <Link
            to="/my/expenses/$expenseName"
            params={{ expenseName: parent.name }}
          >
            Back
          </Link>
        )}
        <h2>{expense.title}</h2>
        <ul>
          {expense.children.map((child) => (
            <ExpenseChild name={child.name} key={child.name} />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="">
      {parent && (
        <Link
          to="/my/expenses/$expenseName"
          params={{ expenseName: parent.name }}
        >
          Back
        </Link>
      )}
      <h2>{expense.title}</h2>
      <ul>
        {expense.examples.map((child) => (
          <li key={child.title}>{child.title}</li>
        ))}
      </ul>
    </div>
  );
}
