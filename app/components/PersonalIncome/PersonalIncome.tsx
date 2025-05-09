import { type FC } from "react";
import { PersonalIncomeThumbnail } from "./PersonalIncomeThumbnail";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@mantine/hooks";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Field, FieldMessage } from "../ui/Field";
import {
  PersonalIncomeInput,
  selectTaxCoefficient,
  updateTaxCoefficient,
} from "./PersonalIncomeInput";

export const PersonalIncome: FC<{
  className?: string;
}> = ({ className }) => {
  const [opened, { toggle }] = useDisclosure(false);

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
            <PersonalIncomeInput
              selectValue={(profile) => profile.netIncome}
              updateValue={(profile, netIncome) => ({
                ...profile,
                netIncome,
              })}
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
            <Label>Slevy na daních</Label>
            <PersonalIncomeInput
              selectValue={(profile) => profile.taxCredit}
              updateValue={(profile, taxCredit) => ({
                ...profile,
                taxCredit,
              })}
              min={0}
              max={(profile) => profile.netIncome}
              step={100}
              unit="Kč"
            />
            <FieldMessage>
              Kolik celkem uplatníte slev na dani. Sleva na daňového poplatníka,
              důchodce, na invaliditu, dítě, manžela/manželku, penzijní a
              životní připojištění, úroky z úvěru na bydlení, dary a darování
              krve.
            </FieldMessage>
          </Field>

          <Field>
            <Label>Výdaje se sníženou sazbou DPH</Label>
            <PersonalIncomeInput
              selectValue={(profile) =>
                profile.incomeTaxCoefficients[1211] * 100
              }
              updateValue={(profile, dph) => ({
                ...profile,
                incomeTaxCoefficients: {
                  ...profile.incomeTaxCoefficients,
                  [1211]: dph / 100,
                },
              })}
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
            <PersonalIncomeInput
              selectValue={selectTaxCoefficient(1221)}
              updateValue={updateTaxCoefficient(1221)}
              min={0}
              max={(profile) => profile.netIncome * 0.3}
              step={500}
              unit="Kč"
            />
            <FieldMessage>
              Kolik měsíčně utratíte za benzín a naftu.
            </FieldMessage>
          </Field>
        </div>
      </div>
    </div>
  );
};
