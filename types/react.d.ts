import "react";

declare global {
  namespace React {
    interface CSSProperties {
      // React type definitions does not know viewTransitionClass prop yet
      // So just extend it here manually for now, until they update the definitions.
      viewTransitionClass?: string;
    }
  }
}
