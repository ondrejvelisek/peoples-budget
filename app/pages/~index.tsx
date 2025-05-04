import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  return (
    <>
      <h1 className="lg:hidden text-4xl font-serif px-8 pt-8 whitespace-nowrap">
        Tak kam s&nbsp;tím?
      </h1>
      <div className="bg-hero-img-square max-h-full lg:bg-hero-img bg-no-repeat bg-cover aspect-square lg:aspect-video mb-8 flex items-center">
        <div className="hidden lg:block pl-12 w-5/12">
          <h1 className="text-6xl font-serif pb-8">Tak&nbsp;kam s&nbsp;tím?</h1>
          <p className="hidden md:block text-sm  md:text-base xl:text-lg">
            Rozpočet národa je interaktivní aplikace, která Vám umožní
            prozkoumat státní rozpočet České republiky a zjistit, kam putují
            naše peníze. Vyzkoušejte si, jak byste rozdělili peníze Vy! Sdílejte
            své nápady a názory s ostatními.
          </p>
        </div>
      </div>

      <div className="p-8 lg:p-12">
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
