import { type FC } from "react";

export const ColorPalette: FC = () => {
  return (
    <div className="flex absolute bottom-2 left-2">
      <div className="flex flex-col">
        <div className="w-4 h-4 bg-sand-200" />
        <div className="w-4 h-4 bg-sand-400" />
        <div className="w-4 h-4 bg-sand-500" />
        <div className="w-4 h-4 bg-sand-600" />
      </div>
      <div className="flex flex-col">
        <div className="w-4 h-4 bg-amber-400" />
        <div className="w-4 h-4 bg-amber-500" />
        <div className="w-4 h-4 bg-rose-600" />
        <div className="w-4 h-4 bg-rose-700" />
      </div>
    </div>
  );
};
