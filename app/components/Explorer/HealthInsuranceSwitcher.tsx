import { type FC } from "react";
import { cn } from "@/lib/utils";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { LiaSlashSolid } from "react-icons/lia";
import { Button, ButtonTab } from "../ui/button";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const useHealthInsurance = (): [boolean, () => void] => {
  const { health } = useSearch({
    strict: false,
  });
  const navigate = useNavigate();
  const isTurnedOn = health ?? true;
  return [
    isTurnedOn,
    () => {
      navigate({
        to: ".",
        search: {
          health: !isTurnedOn,
        },
      });
    },
  ];
};

export type HealthInsuranceSwitcherProps = {
  className?: string;
  style?: React.CSSProperties;
};

export const HealthInsuranceSwitcher: FC<HealthInsuranceSwitcherProps> = ({
  className,
  style,
}) => {
  const [healthInsurance, toggleHealthInsurance] = useHealthInsurance();

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <Button
          variant="tab"
          size="tab"
          className={cn("relative", className)}
          style={style}
          onClick={toggleHealthInsurance}
        >
          <ButtonTab>
            <HealthInsuranceIcon isTurnedOn={healthInsurance} />
          </ButtonTab>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {healthInsurance
          ? "Vyjmout zdravotní pojištění z výpočtů"
          : "Zahrnout zdravotní pojištění do výpočtů"}
      </TooltipContent>
    </Tooltip>
  );
};

const HealthInsuranceIcon: FC<{ isTurnedOn: boolean }> = ({ isTurnedOn }) => {
  return (
    <div className={cn("relative overflow-hidden text-xl")}>
      <MdOutlineHealthAndSafety />
      <div
        className={cn(
          "absolute left-0 top-0 transition-[transform,opacity] duration-500 ease-snap",
          {
            "-translate-x-3 -translate-y-3 opacity-0": isTurnedOn,
          },
        )}
      >
        <LiaSlashSolid className="absolute -left-px top-0 rotate-90 drop-shadow-white-top-right" />
      </div>
    </div>
  );
};
