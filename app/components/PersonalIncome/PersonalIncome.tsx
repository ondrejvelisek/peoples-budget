import { type FC } from "react";
import { PersonalIncomeThumbnail } from "./PersonalIncomeThumbnail";
import { cn, formatCurrencyStandard } from "@/lib/utils";
import { useDisclosure } from "@mantine/hooks";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Field, FieldMessage } from "../ui/Field";
import {
  PersonalIncomeInput,
  selectTaxCoefficient,
  updateTaxCoefficient,
} from "./PersonalIncomeInput";
import {
  usePersonalIncome,
  usePersonalProfileNotSeenYet,
} from "@/data/personalIncome/personalIncomeHook";
import { Button } from "../ui/button";
import { InProgress } from "../InProgress/InProgress";

export const PersonalIncome: FC<{
  className?: string;
}> = ({ className }) => {
  const [opened, { toggle, open }] = useDisclosure(false);
  const { personalIncome, totalPersonalContributions } = usePersonalIncome();
  usePersonalProfileNotSeenYet(open);

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
        <div className="flex flex-col gap-7 p-3 pb-5 pt-1">
          {personalIncome && totalPersonalContributions && (
            <div className="flex flex-col items-center">
              <div className="text-center text-sm">
                Kdybyste státu&nbsp;nic&nbsp;neplatil/a,
                vyděláte&nbsp;měsíčně&nbsp;celkem
              </div>
              <div>
                <span className="text-center text-2xl font-bold">
                  {formatCurrencyStandard(
                    personalIncome.perceivedNetIncome +
                      totalPersonalContributions
                  )}
                </span>
                &nbsp;Kč
              </div>
            </div>
          )}

          <h2 className="text-lg font-bold leading-none">
            Nastavení osobního profilu
          </h2>

          <Tabs value="employee">
            <TabsList className="flex">
              <TabsTrigger value="employee" className="grow">
                Zaměstnanec
              </TabsTrigger>

              <InProgress className="grow">
                <TabsTrigger value="self-employed" className="grow">
                  Podnikatel
                </TabsTrigger>
              </InProgress>
            </TabsList>
          </Tabs>

          <Field>
            <Label>Čistý měsíční příjem</Label>
            <PersonalIncomeInput
              selectValue={(profile) => profile.netIncome}
              updateValue={(netIncome) => ({ netIncome })}
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
              updateValue={(taxCredit) => ({ taxCredit })}
              min={0}
              max={(profile) => profile.netIncome}
              step={500}
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
              updateValue={(dph) => ({
                incomeTaxCoefficients: { [1211]: dph / 100 },
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

          <Field>
            <Label>Pivo</Label>
            <PersonalIncomeInput
              selectValue={selectTaxCoefficient(1223)}
              updateValue={updateTaxCoefficient(1223)}
              min={0}
              max={(profile) => profile.netIncome * 0.3}
              step={500}
              unit="Kč"
            />
            <FieldMessage>
              Kolik celkem měsíčně utratíte za pivo. Včetně spotřeby doma, v
              restauracích, na dovoléné a dárků pro druhé.
            </FieldMessage>
          </Field>

          <Field>
            <Label>Víno</Label>
            <PersonalIncomeInput
              selectValue={selectTaxCoefficient(1224)}
              updateValue={updateTaxCoefficient(1224)}
              min={0}
              max={(profile) => profile.netIncome * 0.3}
              step={500}
              unit="Kč"
            />
            <FieldMessage>
              Kolik celkem měsíčně utratíte za víno. Včetně spotřeby doma, v
              restauracích, na dovoléné a dárků pro druhé.
            </FieldMessage>
          </Field>

          <Field>
            <Label>Tvrdý alkohol</Label>
            <PersonalIncomeInput
              selectValue={selectTaxCoefficient(1222)}
              updateValue={updateTaxCoefficient(1222)}
              min={0}
              max={(profile) => profile.netIncome * 0.3}
              step={500}
              unit="Kč"
            />
            <FieldMessage>
              Kolik celkem měsíčně utratíte za tvrdý alkohol. Včetně spotřeby
              doma, v restauracích, na dovoléné a dárků pro druhé.
            </FieldMessage>
          </Field>

          <Field>
            <Label>Pálené tabákové výrobky</Label>
            <PersonalIncomeInput
              selectValue={selectTaxCoefficient(1225)}
              updateValue={updateTaxCoefficient(1225)}
              min={0}
              max={(profile) => profile.netIncome * 0.3}
              step={500}
              unit="Kč"
            />
            <FieldMessage>
              Kolik celkem měsíčně utratíte za cigarety, doutníky a tabák do
              dýmek. Včetně spotřeby doma, v restauracích, na dovoléné a dárků
              pro druhé.
            </FieldMessage>
          </Field>

          <Field>
            <Label>Zahřívané tabákové výrobky</Label>
            <PersonalIncomeInput
              selectValue={selectTaxCoefficient(1229)}
              updateValue={updateTaxCoefficient(1229)}
              min={0}
              max={(profile) => profile.netIncome * 0.3}
              step={500}
              unit="Kč"
            />
            <FieldMessage>
              Kolik celkem měsíčně utratíte za elektronické cigarety. Včetně
              spotřeby doma, v restauracích, na dovoléné a dárků pro druhé.
            </FieldMessage>
          </Field>

          <Field>
            <Label>Elektřina</Label>
            <PersonalIncomeInput
              selectValue={selectTaxCoefficient(1233)}
              updateValue={updateTaxCoefficient(1233)}
              min={0}
              max={(profile) => profile.netIncome * 0.3}
              step={500}
              unit="Kč"
            />
            <FieldMessage>Kolik měsíčně utratíte za elektřinu.</FieldMessage>
          </Field>

          <Field>
            <Label>Zemní plyn</Label>
            <PersonalIncomeInput
              selectValue={selectTaxCoefficient(1231)}
              updateValue={updateTaxCoefficient(1231)}
              min={0}
              max={(profile) => profile.netIncome * 0.3}
              step={500}
              unit="Kč"
            />
            <FieldMessage>Kolik měsíčně utratíte za plyn.</FieldMessage>
          </Field>

          <Field>
            <Label>Tuhá paliva</Label>
            <PersonalIncomeInput
              selectValue={selectTaxCoefficient(1232)}
              updateValue={updateTaxCoefficient(1232)}
              min={0}
              max={(profile) => profile.netIncome * 0.3}
              step={500}
              unit="Kč"
            />
            <FieldMessage>
              Kolik měsíčně utratíte za uhlí, brikety a dřevo na vytápění.
            </FieldMessage>
          </Field>

          <div className="flex flex-col items-center gap-1">
            <Button onClick={toggle}>Pokračovat</Button>
            <div className="text-xs text-sand-400">
              Změny se ukládají automaticky
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
