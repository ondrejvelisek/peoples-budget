import { type FC } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { RiArrowDownSLine } from "react-icons/ri";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EXPENSE_DIMENSIONS } from "@/data/expenseDimensions";

export const ExpenseDimensionSwitcher: FC = () => {
  const splat = useParams({ strict: false })._splat;
  const expenseKey = splat?.expenseKey;
  const expenseDimension = splat?.expenseDimension;
  if (!expenseKey) {
    throw new Error("ExpenseDimensionSwitcher: Missing expenseKey in url");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="@lg:hidden" asChild>
          <Tabs value={expenseDimension}>
            <TabsList>
              <TabsTrigger value={expenseDimension ?? ""}>
                {expenseDimension
                  ? EXPENSE_DIMENSIONS[expenseDimension]
                  : "Vyber rozdělení"}
                <RiArrowDownSLine className="ml-1" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link
              to="/2024/$"
              params={{ _splat: { expenseKey, expenseDimension: "odvetvi" } }}
              activeProps={{ className: "font-bold" }}
            >
              Odvětví
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/2024/$"
              params={{ _splat: { expenseKey, expenseDimension: "druh" } }}
              activeProps={{ className: "font-bold" }}
            >
              Druh
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/2024/$"
              params={{ _splat: { expenseKey, expenseDimension: "urad" } }}
              activeProps={{ className: "font-bold" }}
            >
              Úřad
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Tabs value={expenseDimension} className="hidden @lg:block">
        <TabsList>
          <TabsTrigger value="odvetvi" asChild>
            <Link
              to="/2024/$"
              params={{ _splat: { expenseKey, expenseDimension: "odvetvi" } }}
            >
              Odvětví
            </Link>
          </TabsTrigger>
          <TabsTrigger value="druh" asChild>
            <Link
              to="/2024/$"
              params={{ _splat: { expenseKey, expenseDimension: "druh" } }}
            >
              Druh
            </Link>
          </TabsTrigger>
          <TabsTrigger value="urad" asChild>
            <Link
              to="/2024/$"
              params={{ _splat: { expenseKey, expenseDimension: "urad" } }}
            >
              Úřad
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};
