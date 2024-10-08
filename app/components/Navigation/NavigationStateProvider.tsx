import {
  createContext,
  useContext,
  type FC,
  type PropsWithChildren,
} from "react";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";

type NavigationOpenState = ReturnType<typeof useDisclosure>;

type NavigationCondenseState = ReturnType<typeof useLocalStorage<boolean>>;

const NavigationStateContext = createContext<
  { open: NavigationOpenState; condense: NavigationCondenseState } | undefined
>(undefined);

export const useNavigationOpenState = (): NavigationOpenState => {
  const context = useContext(NavigationStateContext);
  if (!context) {
    throw new Error(
      "useNavigationOpenState must be used within a NavigationStateProvider"
    );
  }
  return context.open;
};

export const useNavigationCondenseState = (): NavigationCondenseState => {
  const context = useContext(NavigationStateContext);
  if (!context) {
    throw new Error(
      "useNavigationCondenseState must be used within a NavigationStateProvider"
    );
  }
  return context.condense;
};

export const NavigationStateProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const open = useDisclosure(false);
  const condense = useLocalStorage<boolean>({
    key: "navigation-condensed",
    defaultValue: false,
  });

  return (
    <NavigationStateContext.Provider
      value={{
        open,
        condense,
      }}
    >
      {children}
    </NavigationStateContext.Provider>
  );
};
