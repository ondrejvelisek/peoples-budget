import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  return (
    <>
      <h1 className="whitespace-nowrap px-8 pt-8 font-serif text-4xl lg:hidden">
        Tak kam s&nbsp;tím?
      </h1>
      <div className="mb-8 flex aspect-square max-h-full items-center bg-hero-img-square bg-cover bg-no-repeat lg:aspect-video lg:bg-hero-img">
        <div className="hidden w-5/12 pl-12 lg:block">
          <h1 className="pb-8 font-serif text-6xl">Tak&nbsp;kam s&nbsp;tím?</h1>
          <p className="hidden text-sm md:block  md:text-base xl:text-lg">
            Rozpočet národa je interaktivní aplikace, která Vám umožní
            prozkoumat státní rozpočet České republiky a zjistit, kam putují
            naše peníze. Vyzkoušejte si, jak byste rozdělili peníze Vy! Sdílejte
            své nápady a názory s ostatními.
          </p>
        </div>
      </div>

      <div className="p-8 lg:p-12">
        <h1 className="pb-8 font-serif text-4xl">O projektu</h1>
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
