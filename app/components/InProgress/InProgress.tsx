import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { type FC, type PropsWithChildren } from "react";
import { DialogContent } from "../ui/dialog";
import { DialogTrigger } from "../ui/dialog";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { useDisclosure } from "@mantine/hooks";

type IncomeItemProps = PropsWithChildren<{
  className?: string;
}>;

export const InProgress: FC<IncomeItemProps> = ({ children, className }) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Dialog
      open={opened}
      onOpenChange={(opened) => (opened ? open() : close())}
    >
      <DialogTrigger className={cn("relative", className)} asChild>
        <div>
          {children}
          <svg
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-0 top-0 size-6"
          >
            <defs>
              <pattern
                id="vertical-stripes"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="0"
                  y="0"
                  width="8"
                  height="8"
                  className="fill-amber-400"
                />
                <polygon points="0,0 4,0 0,4" className="fill-sand-600" />
                <polygon points="0,8 4,8 8,4 8,0" className="fill-sand-600" />
              </pattern>
            </defs>

            <ellipse
              cx="10"
              cy="10"
              rx="13"
              ry="1"
              className="translate-x-[10px] translate-y-[-4px] rotate-45 fill-sand-700/20"
            />
            <polygon
              points="0,0 10,0 20,10 20,20"
              fill="url(#vertical-stripes)"
            />
          </svg>
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="absolute inset-x-0 top-0 -m-px h-3 bg-amber-400 bg-diagonal-stripes sm:rounded-t-lg" />
        <h2 className="font-serif text-2xl font-medium">
          Makáme&nbsp;na&nbsp;tom, ale&nbsp;ještě&nbsp;to&nbsp;není
        </h2>
        <p>
          Líbí se vám myšlenka Lidového rozpočtu a chcete ji vidět růst?
          Přispějte prosím na vývoj, udržbu a provoz.
        </p>
        <Button asChild>
          <Link to="/podporit" onClick={close}>
            Podpořit
          </Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
};
