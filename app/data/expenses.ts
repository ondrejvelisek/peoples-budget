import { useBudget } from "@/components/BudgetProvider/BudgetProvider";
import { sum } from "lodash";

type ExpenseItemExample = {
  title: string;
  amount: number;
};

type ExpenseBaseItem = {
  title: string;
  name: string;
};

type ExpenseLeafItem = ExpenseBaseItem & {
  amount: number;
  examples: [ExpenseItemExample, ...ExpenseItemExample[]];
};

type ExpenseInnerItem = ExpenseBaseItem & {
  children: [ExpenseItem, ...ExpenseItem[]];
};

export type ExpenseItem = ExpenseInnerItem | ExpenseLeafItem;

export const expenses: ExpenseInnerItem = {
  title: "Státní rozpočet ČR",
  name: "rozpocet",
  children: [
    {
      title: "Obrana a Bezpečnost",
      name: "obrana-bezpecnost",
      children: [
        {
          title: "Armáda",
          name: "armada",
          amount: 740000000000,
          examples: [{ title: "Plat vojáka", amount: 45000 }],
        },
        {
          title: "Policie",
          name: "policie",
          amount: 700000000000,
          examples: [{ title: "Plat policisty", amount: 35000 }],
        },
        {
          title: "Soudnictví",
          name: "soudnictvi",
          amount: 300000000000,
          examples: [{ title: "Plat soudce", amount: 125000 }],
        },
        {
          title: "Hasiči",
          name: "hasici",
          amount: 30000000000,
          examples: [{ title: "Plat hasiče", amount: 50000 }],
        },
        {
          title: "Záchranný systém",
          name: "zachranny-system",
          amount: 30000000000,
          examples: [{ title: "Plat záchranáře", amount: 60000 }],
        },
      ],
    },
    {
      title: "Školství a Výzkum",
      name: "skolstvi-vyzkum",
      children: [
        {
          title: "Školství",
          name: "skolstvi",
          amount: 740000000000,
          examples: [{ title: "Plat učitele ZŠ", amount: 40000 }],
        },
        {
          title: "Věda a výzkum",
          name: "veda-vyzkum",
          amount: 300000000000,
          examples: [{ title: "Stipendium doktoranda", amount: 25000 }],
        },
      ],
    },
    {
      title: "Doprava",
      name: "doprava",
      children: [
        {
          title: "Silniční",
          name: "silnicni",
          amount: 740000000000,
          examples: [{ title: "km postavených dálnic", amount: 112 }],
        },
        {
          title: "Železniční",
          name: "zeleznicni",
          amount: 300000000000,
          examples: [{ title: "opravených zastávek", amount: 250 }],
        },
      ],
    },
    {
      title: "Sociální systém",
      name: "socialni-system",
      children: [
        {
          title: "Starobní důchody",
          name: "starobni-duchody",
          amount: 740000000000,
          examples: [{ title: "starobní důchod", amount: 22000 }],
        },
        {
          title: "Invalidní důchody",
          name: "invalidni-duchody",
          amount: 30000000000,
          examples: [{ title: "Invalidní důchod 3.", amount: 35000 }],
        },
        {
          title: "Pracovní neschpnost",
          name: "pracovni neschopnost",
          amount: 3000000000,
          examples: [{ title: "Náhrada platu v %", amount: 66 }],
        },
      ],
    },
    {
      title: "Zdravotnictví",
      name: "zdravotnictvi",
      children: [
        {
          title: "Invalidní důchody",
          name: "invalidni-duchody",
          amount: 30000000000,
          examples: [{ title: "Invalidní důchod 3.", amount: 35000 }],
        },
        {
          title: "Pracovní neschpnost",
          name: "pracovni neschopnost",
          amount: 3000000000,
          examples: [{ title: "Náhrada platu v %", amount: 66 }],
        },
      ],
    },
    {
      title: "Dotace",
      name: "dotace",
      children: [
        {
          title: "Dotace do podnikání",
          name: "dotace-podnikani",
          amount: 30000000000,
          examples: [{ title: "Počet dotačních programů", amount: 350 }],
        },
        {
          title: "Životní prostředí",
          name: "zivotni-prostredi",
          amount: 3000000000,
          examples: [{ title: "Vysazených stromů", amount: 660 }],
        },
      ],
    },
    {
      title: "Dluh a Rezerva",
      name: "dluh-rezerva",
      children: [
        {
          title: "Dluh",
          name: "dluh",
          amount: 30000000000,
          examples: [{ title: "Splátka dluhu", amount: 3500000 }],
        },
        {
          title: "Rezerva",
          name: "rezerva",
          amount: 300000000,
          examples: [{ title: "Rezerva v %", amount: 5 }],
        },
      ],
    },
  ],
};

export function findByName(
  name: string,
  item: ExpenseItem = expenses
): ExpenseItem | undefined {
  if (item.name === name) {
    return item;
  }

  if ("children" in item) {
    for (const child of item.children) {
      const found = findByName(name, child);
      if (found) {
        return found;
      }
    }
  }
}

export function findParent(
  name: string,
  item: ExpenseItem = expenses
): ExpenseItem | undefined {
  if ("children" in item) {
    for (const child of item.children) {
      if (child.name === name) {
        return item;
      }

      const found = findParent(name, child);
      if (found) {
        return found;
      }
    }
  }
}

export function calcAmount(item: ExpenseItem = expenses): number {
  if (!item) {
    return 0;
  }
  if ("amount" in item) {
    return item.amount;
  }

  return sum(item.children.map(calcAmount));
}

export const useExpense = (expenseName?: string) => {
  const { budgetName } = useBudget();
  console.log("budgetName: ", budgetName);
  if (!expenseName) {
    const amount = calcAmount(expenses);
    return [expenses, amount, undefined] as const;
  }
  const expense = findByName(expenseName, expenses);
  const amount = calcAmount(expense);
  const parent = findParent(expenseName, expenses);
  return [expense, amount, parent] as const;
};
