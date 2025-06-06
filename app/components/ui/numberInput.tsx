import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn, formatCurrencyStandard } from "@/lib/utils";
import { Input } from "./input";
import { Button } from "./button";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { RxDragHandleDots1 } from "react-icons/rx";

const NumberInput = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    unit?: string;
  }
>(({ className, unit, ...props }, ref) => {
  const [raw, setRaw] = useState<number | undefined>(props.value?.[0]);
  const [focused, { open: focus, close: blur }] = useDisclosure(false);
  const value = focused ? raw : props.value?.[0];

  const setValue = (rawValue: number | undefined) => {
    if (rawValue === undefined || isNaN(rawValue)) {
      setRaw(undefined);
      return;
    }

    setRaw(rawValue);
    if (
      !isNaN(rawValue) &&
      props.min !== undefined &&
      rawValue >= props.min &&
      props.max !== undefined &&
      rawValue <= props.max
    ) {
      props.onValueChange?.([rawValue]);
      props.onValueCommit?.([rawValue]);
    }
  };
  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        className="lg:rounded-r-none -mr-px lg:m-0"
        onClick={() => {
          if (value === undefined) {
            const fallback = props.value?.[0] ?? props.min ?? props.max ?? 0;
            setValue(fallback);
            return;
          }

          const step = props.step ?? 1;
          const isInteger = Number.isInteger(value);
          const isStepMultiple = step ? value % step === 0 : true;
          if (!isInteger || !isStepMultiple) {
            // round to nearest step below
            const rounded = Math.floor(value / step) * step;
            setValue(rounded);
            return;
          }

          setValue(value - step);
        }}
      >
        –
      </Button>
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "lg:hidden relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
        value={[value ?? props.value?.[0] ?? props.min ?? props.max ?? 0]}
        onValueChange={(values) => {
          const value = values[0];
          setRaw(value);
          props.onValueChange?.(values);
        }}
        onFocus={() => {
          setRaw(props.value?.[0]);
          focus();
        }}
        onBlur={() => {
          setRaw(props.value?.[0]);
          blur();
        }}
      >
        <SliderPrimitive.Track className="relative h-px w-full grow overflow-hidden bg-sand-200">
          <SliderPrimitive.Range className="absolute h-full bg-sand-200" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb asChild>
          <div className="bg-white border border-sand-200 pl-4 pr-1 p-2 rounded-md flex items-center justify-between text-sm h-10 w-32 text-sand-600 group cursor-move">
            <span>
              {value !== undefined
                ? `${formatCurrencyStandard(value)} ${unit ?? ""}`
                : ""}
            </span>
            <RxDragHandleDots1 className="inline-block text-2xl ml-1 text-sand-350 group-hover:text-black " />
          </div>
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>

      <Input
        className="hidden lg:block grow rounded-none z-10 border-x-0"
        type="text"
        pattern="\d*"
        value={value === undefined ? "" : Math.round(value).toString()}
        onChange={(e) => {
          if (e.target.value === "") {
            setRaw(undefined);
            return;
          }
          const value = Number(e.target.value);
          if (isNaN(value)) {
            return;
          }
          setValue(value);
        }}
        onFocus={() => {
          setRaw(props.value?.[0]);
          focus();
        }}
        onBlur={() => {
          setRaw(props.value?.[0]);
          blur();
        }}
      />
      {unit && (
        <div className="size-10 border-y border-sand-200 hidden lg:flex items-center justify-center p-3">
          {unit}
        </div>
      )}

      <Button
        className="lg:rounded-l-none lg:m-0 -ml-px"
        variant="outline"
        onClick={() => {
          if (value === undefined) {
            const fallback = props.value?.[0] ?? props.min ?? props.max ?? 0;
            setValue(fallback);
            return;
          }

          const step = props.step ?? 1;
          const isInteger = Number.isInteger(value);
          const isStepMultiple = value % step === 0;
          if (!isInteger || !isStepMultiple) {
            // round to nearest step above
            const rounded = Math.ceil(value / step) * step;
            setValue(rounded);
            return;
          }

          setValue(value + step);
        }}
      >
        +
      </Button>
    </div>
  );
});
NumberInput.displayName = "NumberInput";

export { NumberInput };
