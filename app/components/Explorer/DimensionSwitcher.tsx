import { type FC } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { RiArrowDownSLine } from "react-icons/ri";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DIMENSIONS, type Dimension } from "@/data/dimensions";
import { cn } from "@/lib/utils";

export type DimensionSwitcherProps = {
  currentDimension?: Dimension;
  dimensionLinks: Array<LinkProps>;
  className?: string;
  style?: React.CSSProperties;
};

export const DimensionSwitcher: FC<DimensionSwitcherProps> = ({
  currentDimension,
  dimensionLinks,
  className,
  style,
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          style={style}
          className={cn("flex @lg:hidden", className)}
          asChild
        >
          <Tabs value={currentDimension}>
            <TabsList>
              <TabsTrigger value={currentDimension ?? ""}>
                {currentDimension
                  ? DIMENSIONS[currentDimension]
                  : "Vyber rozdělení"}
                <RiArrowDownSLine className="ml-1" />
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
      <Tabs
        value={currentDimension}
        style={style}
        className={cn("hidden @lg:flex", className)}
      >
        <TabsList>
          {dimensionLinks.map((linkProps) => {
            const dimension = getDimensionFromLinkParams(linkProps.params);
            return (
              <TabsTrigger key={dimension} value={dimension} asChild>
                <Link
                  {...linkProps}
                  activeProps={{ className: "font-bold" }}
                  viewTransition
                >
                  {DIMENSIONS[dimension]}
                </Link>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </>
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
