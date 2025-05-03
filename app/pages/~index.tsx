import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  return (
    <>
      <div className="p-4 bg-hero-img h-full bg-center bg-cover relative">
        <div className="p-4 absolute top-20 md:left-20 sm:w-2/3 md:w-1/3">
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-serif pb-8">
            Tak kam s&nbsp;tím?
          </h1>
          <p className="hidden sm:block text-sm  md:text-base xl:text-lg">
            Rozpočet národa je interaktivní aplikace, která Vám umožní
            prozkoumat státní rozpočet České republiky a zjistit, kam putují
            naše peníze. Vyzkoušejte si, jak byste rozdělili peníze Vy! Sdílejte
            své nápady a názory s ostatními.
          </p>
        </div>
      </div>
      <div className="p-8">
        <h1 className="text-4xl font-serif pb-8">O projektu</h1>
        <p>
          Rozpočet národa je interaktivní aplikace, která Vám umožní prozkoumat
          státní rozpočet České republiky a zjistit, kam putují naše peníze.
          Vyzkoušejte si, jak byste rozdělili peníze Vy! Sdílejte své nápady a
          názory s ostatními.
        </p>
      </div>
    </>
  );
}
