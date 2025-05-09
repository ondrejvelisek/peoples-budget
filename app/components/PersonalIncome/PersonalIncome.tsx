import { type FC } from "react";
import { PersonalIncomeThumbnail } from "./PersonalIncomeThumbnail";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@mantine/hooks";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export const PersonalIncome: FC<{
  className?: string;
}> = ({ className }) => {
  const [opened, { toggle }] = useDisclosure();
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
        <div className="p-3">
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
        </div>
      </div>
    </div>
  );
};
