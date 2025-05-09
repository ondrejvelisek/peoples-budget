import { useState, type FC } from "react";
import { PersonalIncomeThumbnail } from "./PersonalIncomeThumbnail";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@mantine/hooks";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { NumberInput } from "../ui/numberInput";
import { Field, FieldMessage } from "../ui/Field";

export const PersonalIncome: FC<{
  className?: string;
}> = ({ className }) => {
  const [opened, { toggle }] = useDisclosure(true);
  const [netIncome, setNetIncome] = useState<number>(34000);
  const [dph, setDph] = useState<number>(50);
  const [gass, setGass] = useState<number>(4000);
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
        className={cn(
          "max-h-0 flex-1 overflow-y-auto transition-all duration-500",
          {
            "max-h-screen": opened,
          }
        )}
      >
        <div className="flex flex-col gap-7 p-3 pb-5">
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

          <Field>
            <Label>Čistý měsíční příjem</Label>
            <NumberInput
              value={[netIncome]}
              onValueCommit={(value) => value[0] && setNetIncome(value[0])}
              min={10000}
              max={250000}
              step={1000}
              unit="Kč"
            />
            <FieldMessage>
              Kolik vám průměrně každý měsíc přijde na účet. Přijmy ze všech
              zaměstnání, brigád, pronájmu nemovitostí, zisky z investic a
              dividendy.
            </FieldMessage>
          </Field>

          <Field>
            <Label>Výdaje se sníženou sazbou DPH</Label>
            <NumberInput
              value={[dph]}
              onValueCommit={(value) =>
                value[0] !== undefined && setDph(value[0])
              }
              min={0}
              max={100}
              step={5}
              unit="%"
            />
            <FieldMessage>
              Kolik procent utratíte za produkty a služby se sníženou sazbou.
              Včetně dárků, konzumace v restauracích a nákupech na dovolených.
              Voda, potraviny, léky a zdravo, ubytování, vstupenky na kulturní a
              sportovní akce, krmiva pro zvířata, rostliny, knihy a noviny.
            </FieldMessage>
          </Field>

          <Field>
            <Label>Pohonné hmoty</Label>
            <NumberInput
              value={[gass]}
              onValueCommit={(value) =>
                value[0] !== undefined && setGass(value[0])
              }
              min={0}
              max={netIncome * 0.3}
              step={500}
              unit="Kč"
            />
            <FieldMessage>
              Kolik měsíčně utratíte za pohonné hmoty.
            </FieldMessage>
          </Field>
        </div>
      </div>
    </div>
  );
};
