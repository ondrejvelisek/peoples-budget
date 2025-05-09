import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Button } from "./button";
import { useState } from "react";
import { useDisclosure, useToggle } from "@mantine/hooks";

const NumberInput = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [raw, setRaw] = useState<string>(props.value?.[0]?.toString() ?? "");
  const [focused, { open: focus, close: blur }] = useDisclosure(false);
  const value = focused ? Number(raw) : (props.value?.[0] ?? 0);

  const setValue = (rawValue: string) => {
    const value = Number(rawValue);
    if (!isNaN(value) || rawValue === "") {
      setRaw(rawValue);
    }
    if (
      !isNaN(value) &&
      props.min &&
      value >= props.min &&
      props.max &&
      value <= props.max
    ) {
      props.onValueChange?.([value]);
      props.onValueCommit?.([value]);
    }
  };
  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        className="aspect-square"
        onClick={() => {
          setValue(`${value - (props.step ?? 1)}`);
        }}
      >
        –
      </Button>
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
        value={[value]}
        onValueChange={(values) => {
          const value = values[0];
          setRaw(value?.toString() ?? "");
          props.onValueChange?.(values);
        }}
        onFocus={focus}
        onBlur={() => {
          setRaw(props.value?.[0]?.toString() ?? "");
          blur();
        }}
      >
        <SliderPrimitive.Track className="relative h-px w-full grow overflow-hidden bg-sand-200">
          <SliderPrimitive.Range className="absolute h-full bg-sand-200" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb asChild>
          <Input
            type="text"
            pattern="\d*"
            placeholder="Zadejte číslo"
            className="w-24"
            value={value.toString()}
            onChange={(e) => setValue(e.target.value)}
          />
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
      <Button
        variant="outline"
        onClick={() => {
          setValue(`${value + (props.step ?? 1)}`);
        }}
      >
        +
      </Button>
    </div>
  );
});
NumberInput.displayName = "NumberInput";

export { NumberInput };
