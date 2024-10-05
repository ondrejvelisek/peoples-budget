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
        onClick={close}
        className={cn(
          "absolute inset-x-0 bottom-0 top-10 rounded-2xl bg-white transition-all md:left-[--sidebar-w] md:top-0 md:rounded-l-2xl md:rounded-r-none",
          {
            "translate-x-[calc(var(--sidebar-w)-5%)] md:translate-x-0 scale-90 md:scale-100 botom-0 md:bottom-0":
              isOpen,
            "md:left-11": isCondese,
          }
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default withProviders<PropsWithChildren>(NavigationStateProvider)(
  Navigation
);
