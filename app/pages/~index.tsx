import { createFileRoute } from "@tanstack/react-router";
import {
  RiArrowDownSLine,
  RiGithubFill,
  RiLinkedinBoxFill,
  RiTwitterXFill,
} from "react-icons/ri";
import heroImgSquare from "./hero-img-square.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { InProgress } from "@/components/InProgress/InProgress";
import myPhoto from "./ondrejvelisek-photo.png";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="lg:hidden">
          <h1 className="whitespace-nowrap px-6 pt-6 font-serif text-4xl leading-tight">
            Zjisti, kam jdou <br />
            tvoje peníze
          </h1>
          <img
            src={heroImgSquare}
            alt="Ilustrace českého lva s kolečky plných peněz"
            className="w-full object-cover pb-6"
          />
          <div className="px-6">
            <p className="pb-4 text-stone-700">
              Dohromady jsme za rok 2025 nahromadili 2,7 bilionů korun. Daň z
              příjmů, sociální a zdravotní, DPH, spotřební daně a spoustu
              dalších. Kdybychom nic z toho nezaplatili, každý si vyděláme víc
              než dvojnásobek.
            </p>
            <p className="pb-6 text-stone-600">
              Co se s tou hromadou peněz děje? Jaké služby stát zajišťuje? A
              kolik mě která služba stojí? Potřebujeme všechny?
            </p>
            <Button size="lg" asChild className="w-full text-base shadow-lg">
              <Link
                to="/vladni/$budgetName"
                params={{ budgetName: "2026-Babis" }}
                search={{ health: true }}
              >
                Prozkoumat rozpočet 2026
              </Link>
            </Button>
          </div>
        </div>

        <div className="hidden min-h-screen items-center bg-hero-img bg-contain bg-right bg-no-repeat lg:flex">
          <div className="w-1/2 pl-12 xl:pl-20">
            <h1 className="mb-6 font-serif text-5xl leading-tight text-stone-900">
              Kam&nbsp;jdou tvoje&nbsp;peníze?
            </h1>
            <p className="mb-4 max-w-xl text-lg text-stone-600">
              Dohromady jsme za rok 2025 nahromadili 2,7 bilionů korun. Daň z
              příjmů, sociální a zdravotní, DPH, spotřební daně a spoustu
              dalších. Kdybychom nic z toho nezaplatili, každý si vyděláme víc
              než dvojnásobek.
            </p>
            <p className="mb-8 max-w-xl text-lg text-stone-600">
              Co se s tou hromadou peněz děje? Jaké služby stát zajišťuje? A
              kolik mě která služba stojí? Potřebujeme všechny?
            </p>
            <Button size="lg" asChild className="px-8 py-6 text-lg shadow-xl">
              <Link
                to="/vladni/$budgetName"
                params={{ budgetName: "2026-Babis" }}
                search={{ health: true }}
              >
                Prozkoumat rozpočet 2026
              </Link>
            </Button>
          </div>
          <Button
            size="sm"
            variant="default"
            className="absolute bottom-4 left-1/2 size-12 -translate-x-1/2 animate-bounce duration-1000"
            onClick={() => {
              document
                .getElementById("scroll-container")
                ?.scrollBy({ top: 500, behavior: "smooth" });
            }}
          >
            <RiArrowDownSLine className="size-6" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-sand-50 px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center font-serif text-3xl md:text-4xl">
            Co projekt nabízí
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Link
              to="/vladni/$budgetName"
              params={{ budgetName: "2026-Babis" }}
              className="rounded-xl bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              <h3 className="mb-3 text-xl font-bold text-stone-800">
                Osobní vyúčtování
              </h3>
              <p className="text-stone-600">
                Zadejte svůj příjem a zjistěte, kolik platíte za jednotlivé
                služby státu. Od školství přes obranu až po obsluhu státního
                dluhu.
              </p>
            </Link>
            <Link
              to="/vladni/$budgetName"
              params={{ budgetName: "2026-Babis" }}
              className="rounded-xl bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              <h3 className="mb-3 text-xl font-bold text-stone-800">
                Interaktivní průzkumník
              </h3>
              <p className="text-stone-600">
                Proklikejte se rozpočtem do nejmenších detailů. Data jsou
                přehledně vizualizovaná a snadno pochopitelná.
              </p>
            </Link>
            <Link
              to="/compare"
              className="rounded-xl bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              <h3 className="mb-3 text-xl font-bold text-stone-800">
                Porovnání rozpočtů
              </h3>
              <p className="text-stone-600">
                Babiš proti Fialovi. Sledujte, jak se mění priority státu v
                průběhu let a volebních období. Kdo vás nutí platit více a za
                co?
              </p>
            </Link>
            <InProgress className="cursor-pointer rounded-xl bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl">
              <h3 className="mb-3 text-xl font-bold text-stone-800">
                Váš vlastní rozpočet{" "}
                <span className="font-normal text-stone-400">(Již brzy!)</span>
              </h3>
              <p className="text-stone-600">
                Zahrajte si na ministra financí. Navrhněte vlastní změny v
                rozpočtu a sdílejte svou vizi s ostatními.
              </p>
            </InProgress>
          </div>
          <div className="mt-8 text-center">
            <p className="mb-4 text-stone-600">
              Máte nápad na další funkci? Chybí vám tu něco?
            </p>
            <Button asChild variant="outline">
              <a
                href="https://diskutuj.digital/t/lidovyrozpocet-cz-porovnani-rozpoctu-babise-a-fialy/1634"
                target="_blank"
                rel="noopener noreferrer"
              >
                Dejte mi vědět
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* About projct section */}
      <section className="px-6 pb-10 pt-12 text-justify [hyphens:auto] lg:px-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <hgroup>
            <h2 className="font-serif text-3xl md:text-4xl">
              Stát nejsou „oni“, stát jsme my
            </h2>
            <h3 className="text-lg text-stone-500">
              Proč vznikl Lidový rozpočet?
            </h3>
          </hgroup>
          <p>
            Jedna věc mě vytáčí. Takový ten klasický český sport: nadávat u piva
            (nebo na Twitteru), jak nám „stát“ zase bere peníze a jak nám ten
            stejný „stát“ dává málo. Je to takový národní folklór. Ale když se
            nad tím zamyslíme víc, zjistíme, že v téhle rovnici nám chybí jedna
            zásadní proměnná. My.
          </p>

          <p>
            Pojďme si nalít čistého vína. Státní peníze nejsou nějaký magický
            poklad, který politici našli na konci duhy. Jsou to naše peníze.
            Moje, tvoje, sousedovi. My všichni jsme v roce 2025 složili na
            hromadu 2,7 bilionu korun.
          </p>

          <p>
            Když to rozpočítám na jednoho pracujícího člověka, vychází to zhruba
            na 43 000 korun měsíčně. To je šílená částka, co? Je to víc, než má
            většina lidí jako čistou mzdu. Prakticky bys mohl brát dvojnásobek,
            kdyby tenhle „stát“ neexistoval. A přesně v tuhle chvíli se ve mně
            perou dva lidi.
          </p>

          <Collapsible>
            <CollapsibleTrigger className="w-full text-left">
              <p className="text-center">
                <Button variant="outline" size="lg">
                  Číst dále ...
                </Button>
              </p>
            </CollapsibleTrigger>
            <CollapsibleContent innerClassName="space-y-6">
              <div className="flex flex-col items-start gap-12 pb-6 pt-4 md:flex-row">
                <div className="basis-1/2 space-y-4">
                  <h4 className="pt-8 font-serif text-xl font-medium">
                    Moje naštvané já
                  </h4>
                  <p>
                    Ta moje část, co miluje svobodu, křičí: „Sakra, 43 tisíc? Za
                    co?! Za ty rozkopané silnice? Za to, že čekám na termín u
                    doktora tři měsíce? Za ty nekonečné papíry na úřadech?“ Štve
                    mě, když vidím, jak se tyhle naše společné peníze sypou do
                    dotací pro miliardáře, rozkrádají při předražených státních
                    zakázkách nebo jdou na zástupy úředníků, kteří tu jsou jen
                    proto, aby kontrolovali jiné úředníky. A co je nejhorší. Z
                    tohoto pochybného systému nejde svobodně vystoupit.
                  </p>
                </div>
                <div className="basis-1/2 space-y-4">
                  <h4 className="pt-8 font-serif text-xl font-medium">
                    Moje zodpovědné já
                  </h4>
                  <p>
                    Jenže pak je tu moje druhá část. Ta, co si uvědomuje, že
                    když se ráno vzbudím, dýchám (relativně) čistý vzduch,
                    protože někdo hlídá emise. Že nemusím živit svoje prarodiče,
                    kteří už nejsou schopní pracovat, protože dostávají starobní
                    důchod. A že když mě na dálnici někdo nabourá, přijede
                    policie a sanitka, kterou jsem si nemusel objednat a
                    zaplatit jako pizzu. Ne všechny peníze skončí v černé díře.
                  </p>{" "}
                </div>
              </div>

              <p>
                Je v pořádku si zanadávat. Vyjadřovat veřejně nespokojenost.
                Tlačit na politiky a úředníky aby zeefktivnili státní systém.
                Ale zároveň je potřeba přemýšlet co s těmi 2,7 bilionu udělat.
                Za co je chceme utratit? A chceme těch peněz vlastně vybírat
                tolik?
              </p>

              <h4 className="pt-8 font-serif text-xl font-medium">
                Začněme mluvit narovinu
              </h4>
              <p>
                Co mě opravdu vadí, je ta naše schizofrenie. Chceme „víc peněz
                pro učitele“, ale „míň daní“. To prostě matematicky nevychází.
                Přeju si, abychom místo nadávání na „toho Fialu“ nebo „toho
                Babiše“ začali mluvit na rovinu.
              </p>

              <p>
                Místo: „Měli by dát víc na obranu,“ řekněme: „Chci, abychom si
                my všichni připlatili na nové stíhačky.“ Místo: „Neměli by
                zvyšovat sociální pojištění,“ řekněme na rovinu: „Chci, aby naši
                prarodiče měli nižší důchody.“ Zní to hnusně, že? Ale tak to
                funguje. Každá služba, kterou od státu chceme, vytahuje peníze
                přímo z naší kapsy. A naopak – každá koruna, kterou chceme
                ušetřit, znamená, že se někde něco ořeže.
              </p>

              <h4 className="pt-8 font-serif text-xl font-medium">
                Výzva k zodpovědnosti
              </h4>
              <p>
                Vůbec mi nevadí, když máš jiný názor na to, kam ty peníze mají
                téct. Klidně se pojďme pohádat o tom, jestli radši dálnice,
                digitální stát nebo vyšší důchody. Nebo nic z toho a raději
                ušetřit na daních. To je zdravá diskuze. Ale co mi vadí, je to
                odosobnění. Ten pocit, že stát je „něco tam nahoře“, co nás jen
                vysává.
              </p>

              <p>
                Pojďme si přiznat tu nepohodlnou zodpovědnost. Máme v rukou
                obrovský balík peněz. Máme zodpovědnost za to, jak s ním
                naložíme. Je to naše společná kasa. Tak se o ni zajímejme. Ne
                jako oběti, ale jako majitelé.
              </p>

              <h4 className="pt-8 font-serif text-xl font-medium">
                Jenže ono to není jen tak
              </h4>
              <p>
                Když jsem se rozhodl, že se přestanu jen rozčilovat a začnu se o
                ten náš státní rozpočet zajímat víc, narazil jsem na zeď. Čekal
                bych, že když jde o nejdůležitější zákon roku, bude k němu
                existovat něco jako přehledný „uživatelský manuál“. Realita?
                Katastrofa.
              </p>

              <p>
                Na webu ministerstva financí najdete pár obřích čísel, která bez
                kontextu nic neříkají. A pak je tu slavný systém{" "}
                <a
                  href="https://monitor.statnipokladna.cz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-stone-300 transition-colors hover:decoration-stone-500"
                >
                  Monitor státní pokladny
                </a>
                . Zkusili jste ho někdy? Pokud zrovna nezahlásí chybu, je pro
                běžného smrtelníka naprosto nepřehledný. Vypadá jako něco z
                minulého tisíciletí a otevřít ho na mobilu? Na to rovnou
                zapomeňte.
              </p>

              <p>
                Vlastně se lidem vůbec nedivím, že se o naše kolektivní peníze
                nezajímají. Kdo to kdy slyšel, aby někdo platil 43 tisíc měsíčně
                za nějaké služby a nedostal k tomu ani pořádné vyúčtování? V
                dnešní době, kdy je vytvoření webové aplikace rychlejší a
                levnější než kdy dřív, je tenhle informační dluh státu naprosto
                neomluvitelný.
              </p>

              <h4 className="pt-8 font-serif text-xl font-medium">
                Proč ne já?
              </h4>
              <p>
                A pak mě to trklo. Informační dluh „státu“? Vždyť jsem vývojář.
                Proč bych měl čekat na to, až to udělají „oni“? Proč bychom si
                to nemohli udělat sami pro sebe?
              </p>

              <p>
                A tak jsem se do toho v roce 2024 pustil a začal pracovat na
                Lidovém rozpočtu. Mým cílem bylo vzít ta složitá, nepřehledná
                data a „přeložit“ je do lidštiny. Chtěl jsem vytvořit místo, kde
                si každý může jednoduše naklikat souvislosti mezi tím, kam jeho
                peníze tečou a co za ně dostává.
              </p>

              <h4 className="pt-8 font-serif text-xl font-medium">
                Takže co je cílem projektu?
              </h4>
              <p>
                Přeju si, aby tento projekt pomohl k zodpovědnější občanské
                společnosti a ke kvalitnější diskuzi. Protože čím víc lidí bude
                rozumět tomu, kam naše peníze tečou, tím větší tlak vznikne na
                politiky a úředníky. Pomůže nám to najít cesty, jak stát
                zefektivnit. A systém rozpočtu pak bude více odpovídat tomu co
                opravdu chceme „my“.
              </p>

              <p>
                Méně plýtvání totiž znamená více peněz pro nás všechny. A o to
                jde především – aby se nám v Česku žilo lépe. Vždyť je to tu
                naše. :)
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>

      {/* About Author Section */}
      <section className="border-t px-6 pt-12 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-serif text-3xl md:text-4xl">
            Kdo za tím stojí
          </h2>
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="shrink-0">
              <div className="mx-auto size-32 overflow-hidden rounded-full bg-stone-200 md:size-40">
                <img
                  src={myPhoto}
                  alt="Ondřej Velíšek"
                  className="mx-auto size-full object-cover"
                />
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <a
                  href="https://x.com/ondrejvelisek"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-500 transition-colors hover:text-stone-900"
                >
                  <RiTwitterXFill className="size-6" />
                </a>
                <a
                  href="https://linkedin.com/in/ondrej-velisek"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-500 transition-colors hover:text-stone-900"
                >
                  <RiLinkedinBoxFill className="size-6" />
                </a>
                <a
                  href="https://github.com/ondrejvelisek"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-500 transition-colors hover:text-stone-900"
                >
                  <RiGithubFill className="size-6" />
                </a>
              </div>
            </div>
            <div className="space-y-4 text-lg text-stone-700">
              <p>
                Jmenuji se Ondřej Velíšek a jsem softwarový vývojář, kterého
                zajímá svět kolem sebe. Vystudoval jsem obor Informační
                technologie na FI MUNI v Brně a od té doby pracuju jako
                programátor. Baví mě zkoumat fungování států, diskutovat o
                jejich problémech a výzvách a sledovat dění v Česku. V tomto
                projektu jsem spojil svoje profesní zkušenosti s mým zájmem o
                společnost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Source Section */}
      <section className="bg-stone-900 px-6 py-12 text-stone-300 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-serif text-3xl text-stone-100 md:text-4xl">
            Odkud beru data?
          </h2>
          <div className="space-y-4">
            <p>
              Data čerpám primárně ze systému Monitor státní pokladny a z
              vydaných finančních plánů zdravotních pojišťoven. V budoucnu sem
              plánuju sepsat mnohem víc informací přehledněji. Zároveň chci
              vysvětlit jak některá čísla počítám. Například výpočet osobního
              odvodu státu za jednotlivé služby. Než to sem sepíšu, zatím si
              můžete prohlédnout zdroje dat a výpočty na GitHubu.
            </p>
            <p className="flex justify-center gap-2">
              <a
                href="https://github.com/ondrejvelisek/peoples-budget/blob/86f7dee5dc48caaf5bfde581646629f57667011d/app/data/files/JAK-ZISKAT-DATA.md"
                className="text-stone-200 underline hover:text-white"
              >
                <Button>Zdroje dat</Button>
              </a>
              <a
                href="https://github.com/ondrejvelisek/peoples-budget/blob/86f7dee5dc48caaf5bfde581646629f57667011d/app/data/personalIncome/personalIncomeCalc.ts"
                className="text-stone-200 underline hover:text-white"
              >
                <Button variant="ghost">Výpočet osobního odvodu</Button>
              </a>
            </p>
            <p className="mt-4 text-sm text-stone-400">
              Našli jste chybu nebo s metodikou nesouhlasíte?{" "}
              <a
                href="https://diskutuj.digital/t/lidovyrozpocet-cz-porovnani-rozpoctu-babise-a-fialy/1634"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-200 underline hover:text-white"
              >
                Dejte mi vědět
              </a>
              , rád to proberu.
            </p>
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="px-6 py-12 text-center lg:px-12">
        <div className="mx-auto max-w-2xl rounded-2xl border border-sand-100 p-8 shadow-md">
          <h2 className="mb-4 font-serif text-3xl text-lime-900">
            Líbí se vám myšlenka Lidového rozpočtu?
          </h2>
          <p className="mb-8 text-lg text-lime-800">
            Chcete ji vidět růst? Projekt vyvíjím ve svém volném čase a provoz
            platím ze svého. Pokud chcete podpořit další vývoj, budu moc vděčný
            za jakýkoliv příspěvek.
          </p>
          <Button asChild size="lg" className="bg-lime-600 hover:bg-lime-700">
            <Link to="/podporit">Podpořit projekt</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
