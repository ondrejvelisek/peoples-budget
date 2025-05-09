import { useState, type FC } from "react";
import { PersonalIncomeThumbnail } from "./PersonalIncomeThumbnail";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@mantine/hooks";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { NumberInput } from "../ui/numberInput";

export const PersonalIncome: FC<{
  className?: string;
}> = ({ className }) => {
  const [opened, { toggle }] = useDisclosure(true);
  const [num, setNum] = useState<number>(37000);
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border-t-2 border-sand-600/15 bg-white outline outline-4 outline-sand-600/5 ",
        className
      )}
    >
      <PersonalIncomeThumbnail
        className="flex-none"
        opened={opened}
        onToggle={toggle}
      />
      <div
        className={cn("max-h-0 flex-1 overflow-y-auto transition-all", {
          "max-h-screen": opened,
        })}
      >
        <div className="flex flex-col gap-6 p-3">
          <Tabs value="employee">
            <TabsList className="flex">
              <TabsTrigger value="employee" className="grow">
                Zaměstnanec
              </TabsTrigger>
              <TabsTrigger value="self-employed" className="grow">
                Podnikatel
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Email" />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <NumberInput
              value={[num]}
              onValueCommit={(value) => setNum(value[0] ?? 37000)}
              min={10000}
              max={300000}
              step={1000}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Slider defaultValue={[33]} max={100} step={1} />
          </div>
        </div>
      </div>
    </div>
  );
};
