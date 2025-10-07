import { createFileRoute } from "@tanstack/react-router";
import heroImgSquare from "./hero-img-square.jpg";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  return (
    <>
      <div className="lg:hidden">
        <h1 className="whitespace-nowrap px-6 pt-6 font-serif text-4xl">
          Tak kam s&nbsp;tím?
        </h1>
        <img
          src={heroImgSquare}
          alt="Ilustrace českého lva s kolečky plných peněz"
          className="pb-6"
        />
        <p className="px-6 pb-4">
          Každý z nás přisypeme každý měsíc na společnou hromádku spoustu peněz.
          Daň z příjmů, sociální a zdravotní, DPH, spotřební daně a spoustu
          dalších. Dohromady jsme za rok 2024 nahromadili 2,5 bilionů korun.
          Kdybychom nic z toho nezaplatili, každý si vyděláme víc než
          dvojnásobek.
        </p>
        <p className="px-6 pb-4">
          Co se s tou hromadou peněz děje? Nikdo z nás nemusí uklízet chodníky
          po kterých chodíme. Můžeme jezdit po silnicích. Sedáme na lavičkách v
          parku. Dostáváme starobní důchod. Za většinu zdravotních služeb
          nemusíme platit. A když se něco stane, můžeme kdykoliv zavolat 112.
        </p>
        <p className="px-6 pb-4">
          Kolik mě která z těch služeb vlastně stojí? Potřebujeme všechny?
          Můžeme někde ušetřit? A nebo některou službu přidat?
        </p>
      </div>
      <div className="mb-8 hidden items-center bg-hero-img bg-contain bg-right bg-no-repeat lg:block">
        <div className="w-5/12 pl-12">
          <h1 className="py-8 font-serif text-6xl">Tak&nbsp;kam s&nbsp;tím?</h1>
          <p className="pb-4 text-base">
            Každý z nás přisypeme každý měsíc na společnou hromádku spoustu
            peněz. Daň z příjmů, sociální a zdravotní, DPH, spotřební daně a
            spoustu dalších. Dohromady jsme za rok 2024 nahromadili 2,5 bilionů
            korun. Kdybychom nic z toho nezaplatili, každý si vyděláme víc než
            dvojnásobek.
          </p>
          <p className="pb-4 text-base">
            Co se s tou hromadou peněz děje? Nikdo z nás nemusí uklízet chodníky
            po kterých chodíme. Můžeme jezdit po silnicích. Sedáme na lavičkách
            v parku. Dostáváme starobní důchod. Za většinu zdravotních služeb
            nemusíme platit. A když se něco stane, můžeme kdykoliv zavolat 112.
          </p>
          <p className="text-base">
            Kolik mě která z těch služeb vlastně stojí? Potřebujeme všechny?
            Můžeme někde ušetřit? A nebo některou službu přidat?
          </p>
        </div>
      </div>

      <div className="p-6 lg:p-12">
        <h1 className="pb-6 font-serif text-4xl">O projektu</h1>
        <p>
          Lidový rozpočet je interaktivní aplikace, která Vám umožní prozkoumat
          státní rozpočet České republiky a zjistit, kam putují naše peníze.
          Kolik za to všechno vy osobně zaplatíte. Vyzkoušejte si, jak byste
          rozdělili peníze Vy a sdílejte své nápady a názory s ostatními.
        </p>
      </div>
    </>
  );
}
