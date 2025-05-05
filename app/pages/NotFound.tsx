import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="flex h-full flex-col gap-2 sm:gap-4">
      <div className="aspect-square max-h-[60%] overflow-hidden bg-not-found-img bg-cover bg-top bg-no-repeat md:aspect-video md:bg-contain" />
      <div className="flex flex-col items-start gap-2 p-4 sm:gap-4 md:p-8 lg:px-16 xl:px-24">
        <h1 className="font-serif text-4xl md:text-5xl xl:text-5xl">
          Tato stránka neexistuje
        </h1>
        <p>
          Omlouváme se, ale stránka, kterou hledáte, nebyla nalezena. Vyberte
          jinou stránku v navigačním menu, nebo pokračujte
        </p>
        <Button asChild variant="default">
          <Link to="/" className="text-center">
            na domovskou stránku
          </Link>
        </Button>
      </div>
    </div>
  );
}
