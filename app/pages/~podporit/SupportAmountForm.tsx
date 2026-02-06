import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NumberInput } from "@/components/ui/numberInput";
import { cn, formatCurrencyStandard } from "@/lib/utils";

export function SupportAmountForm({
  className,
  onSubmit,
  isPending,
}: {
  className?: string;
  onSubmit: (amount: number) => void;
  isPending: boolean;
}) {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [isCustomSelected, setIsCustomSelected] = useState<boolean>(false);
  const isCustomHighlighted =
    isCustomSelected ||
    (amount !== undefined && ![100, 200, 500, 1000].includes(amount));

  const step = !amount
    ? 100
    : amount < 1000
      ? 100
      : amount < 2000
        ? 200
        : amount < 5000
          ? 500
          : amount < 10000
            ? 1000
            : amount < 20000
              ? 2000
              : 5000;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (amount) {
      onSubmit(amount);
    }
  };

  const handlePredefinedClick = (val: number) => {
    setAmount(val);
    setIsCustomSelected(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-3", className)}
    >
      <div className="text-lg ">
        Podpoř&nbsp;projekt libovolnou&nbsp;částkou
      </div>
      <div className="grid grid-cols-2 gap-3">
        <PredefinedAmountButton
          amount={100}
          isSelected={!isCustomSelected && amount === 100}
          onClick={handlePredefinedClick}
          disabled={isPending}
        />
        <PredefinedAmountButton
          amount={200}
          isSelected={!isCustomSelected && amount === 200}
          onClick={handlePredefinedClick}
          disabled={isPending}
        />
        <PredefinedAmountButton
          amount={500}
          isSelected={!isCustomSelected && amount === 500}
          onClick={handlePredefinedClick}
          disabled={isPending}
        />
        <PredefinedAmountButton
          amount={1000}
          isSelected={!isCustomSelected && amount === 1000}
          onClick={handlePredefinedClick}
          disabled={isPending}
        />
      </div>
      <NumberInput
        value={amount ? [amount] : undefined}
        placeholder="Zadej částku"
        onValueChange={(value) => value[0] !== undefined && setAmount(value[0])}
        min={50}
        max={50000}
        step={step}
        onFocus={() => setIsCustomSelected(true)}
        onClick={() => setIsCustomSelected(true)}
        onValueCommit={() => setIsCustomSelected(true)}
        disabled={isPending}
        unit="Kč"
        className="w-full"
        mobileInputClassName={cn("pl-4 font-medium text-black", {
          "ring-4 ring-lime-500 border-transparent": isCustomHighlighted,
        })}
        desktopInputClassName={cn(
          "pl-4 focus:ring-lime-500 focus-visible:outline-0 focus-visible:outline-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-lime-500",
          {}
        )}
        wrapperClassName={cn("rounded-lg", {
          "md:ring-4 md:ring-lime-500": isCustomHighlighted,
        })}
        role="button"
      />
      <Button
        className="w-full"
        size="lg"
        disabled={isPending || !amount}
        type="submit"
      >
        {isPending
          ? "Připravuji platbu..."
          : !amount
            ? "Vyber výši příspěvku"
            : `Přispět ${formatCurrencyStandard(amount)} Kč`}
      </Button>
      <div className="-mt-2 text-center text-xs leading-tight text-stone-400">
        Jde o dar&nbsp;autorovi, ne&nbsp;platbu&nbsp;za&nbsp;službu.
      </div>
    </form>
  );
}

function PredefinedAmountButton({
  amount,
  isSelected,
  onClick,
  disabled,
}: {
  amount: number;
  isSelected: boolean;
  onClick: (amount: number) => void;
  disabled: boolean;
}) {
  return (
    <Button
      variant="outline"
      onClick={() => onClick(amount)}
      disabled={disabled}
      type="button"
      className={cn({
        "border-transparent ring-4 ring-lime-500": isSelected,
      })}
    >
      {formatCurrencyStandard(amount)} Kč
    </Button>
  );
}
