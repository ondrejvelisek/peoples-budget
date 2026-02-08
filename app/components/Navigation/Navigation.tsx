import { type FC, type PropsWithChildren } from "react";

import { cn, withProviders } from "@/lib/utils";
import { useSwipeable } from "react-swipeable";

import {
  NavigationStateProvider,
  useNavigationCondenseState,
  useNavigationOpenState,
} from "./NavigationStateProvider";
import { NavigationHeader } from "./NavigationHeader";
import { NavigationSidebar } from "./NavigationSidebar";

const Navigation: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, { close, open }] = useNavigationOpenState();
  const [isCondese] = useNavigationCondenseState();

  const handlers = useSwipeable({
    onSwipedRight: open,
    onSwipedLeft: close,
  });

  return (
    <div className="relative flex size-full overflow-hidden [--sidebar-w:14rem]">
      <div className="flex size-full flex-col md:w-[--sidebar-w]">
        <NavigationHeader />
        <NavigationSidebar />
      </div>

      <div
        {...(!isOpen ? handlers : {})}
        id="scroll-container"
        className={cn(
          "absolute inset-x-0 -bottom-0.5 top-10 overflow-y-auto rounded-2xl border-x border-b-2 border-sand-300/40 bg-white outline outline-4 outline-sand-400/5 transition-all duration-300 md:left-[--sidebar-w] md:top-0 md:rounded-r-none md:border-x-0",
          {
            "translate-x-[calc(var(--sidebar-w)-5%)] md:translate-x-0 scale-90 md:scale-100 botom-0 md:bottom-0":
              isOpen,
            "md:left-11 md:border-x-0": isCondese,
          }
        )}
      >
        {children}
        {isOpen && (
          <div
            className="absolute inset-0 z-50"
            {...handlers}
            onClick={close}
          />
        )}
      </div>
    </div>
  );
};

export default withProviders<PropsWithChildren>(NavigationStateProvider)(
  Navigation
);
