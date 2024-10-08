import { type FC } from "react";

export const ColorPalette: FC = () => {
  return (
    <div className="absolute bottom-2 left-2 flex">
      <div className="flex flex-col">
        <div className="size-4 bg-sand-200" />
        <div className="size-4 bg-sand-300" />
        <div className="size-4 bg-sand-400" />
        <div className="size-4 bg-sand-500" />
      </div>
      <div className="flex flex-col">
        <div className="size-4 bg-amber-400" />
        <div className="size-4 bg-amber-400" />
        <div className="size-4 bg-amber-500" />
        <div className="size-4 bg-amber-600" />
      </div>
      <div className="flex flex-col">
        <div className="size-4 bg-rose-400" />
        <div className="size-4 bg-rose-500" />
        <div className="size-4 bg-rose-600" />
        <div className="size-4 bg-rose-700" />
      </div>
      <div className="flex flex-col">
        <div className="size-4 bg-sky-300" />
        <div className="size-4 bg-sky-400" />
        <div className="size-4 bg-sky-500" />
        <div className="size-4 bg-sky-600" />
      </div>
      <div className="flex flex-col">
        <div className="size-4 bg-lime-300" />
        <div className="size-4 bg-lime-400" />
        <div className="size-4 bg-lime-500" />
        <div className="size-4 bg-lime-600" />
      </div>
    </div>
  );
};
