import { type FC, type PropsWithChildren } from "react";

import { cn, withProviders } from "@/lib/utils";
import {} from "@/components/ui/tooltip";

import {
  NavigationStateProvider,
  useNavigationCondenseState,
  useNavigationOpenState,
} from "./NavigationStateProvider";
import { NavigationHeader } from "./NavigationHeader";
import { NavigationSidebar } from "./NavigationSidebar";

const Navigation: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, { close }] = useNavigationOpenState();
  const [isCondese] = useNavigationCondenseState();

  return (
    <div className="relative flex size-full overflow-hidden [--sidebar-w:13rem]">
      <div className="flex size-full flex-col md:w-[--sidebar-w]">
        <NavigationHeader />
        <NavigationSidebar />
      </div>

      <div
        className={cn(
          "absolute inset-x-0 -bottom-0.5 top-10 overflow-y-auto rounded-2xl border-x border-b-2 border-sand-600/20 bg-white outline outline-4 outline-sand-500/5 transition-all duration-300 md:left-[--sidebar-w] md:top-0 md:rounded-r-none ",
          {
            "translate-x-[calc(var(--sidebar-w)-5%)] md:translate-x-0 scale-90 md:scale-100 botom-0 md:bottom-0":
              isOpen,
            "md:left-11": isCondese,
          }
        )}
      >
        {children}
        {isOpen && <div className="absolute inset-0" onClick={close} />}
      </div>
    </div>
  );
};

export default withProviders<PropsWithChildren>(NavigationStateProvider)(
  Navigation
);
