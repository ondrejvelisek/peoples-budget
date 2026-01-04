import { type FC } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  DIMENSIONS,
  type Dimension,
} from "@/data/dimensions/personalDimensions";
import { cn } from "@/lib/utils";
import { CgArrowLongDown } from "react-icons/cg";
import { MdSort } from "react-icons/md";

export type SortSwitcherProps = {
  currentDimension?: Dimension;
  dimensionLinks: Array<LinkProps>;
  className?: string;
  style?: React.CSSProperties;
};

export const SortSwitcher: FC<SortSwitcherProps> = ({
  currentDimension,
  dimensionLinks,
  className,
  style,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        style={style}
        className={cn("flex @lg:hidden", className)}
        asChild
      >
        <Tabs value={currentDimension}>
          <TabsList>
            <TabsTrigger value={currentDimension ?? ""} className="pl-0 pr-1">
              <CgArrowLongDown className="-ml-0.5 -mr-2 text-xl" />
              <MdSort className="-mr-0.5 text-base" />
              {/* <MdPercent className="text-base" /> */}
              {/* <MdBalance className="text-base" /> */}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {dimensionLinks.map((linkProps) => {
          const dimension = getDimensionFromLinkParams(linkProps.params);
          return (
            <DropdownMenuItem key={dimension} asChild>
              <Link
                {...linkProps}
                activeProps={{ className: "font-bold" }}
                viewTransition
              >
                {DIMENSIONS[dimension]}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function getDimensionFromLinkParams(params: LinkProps["params"]): Dimension {
  if (typeof params !== "object") {
    throw new Error("DimensionSwitcherLink: params must be an object");
  }
  const splat = params._splat;
  if (!splat) {
    throw new Error("DimensionSwitcherLink: splat must be defined");
  }

  let dimension: Dimension | undefined = undefined;
  if ("expenseDimension" in splat) {
    dimension = splat.expenseDimension;
  } else if ("incomeDimension" in splat) {
    dimension = splat.incomeDimension;
  }

  if (!dimension) {
    throw new Error("DimensionSwitcherLink: dimension must be defined");
  }

  return dimension;
}
