import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="flex flex-col h-full gap-2 sm:gap-4">
      <div className="bg-not-found-img bg-contain bg-no-repeat bg-top aspect-video w-full max-h-[66%]" />
      <div className="p-4 md:p-8 lg:p-16 xl:p-24 flex flex-col gap-2 sm:gap-4 items-start">
        <h1 className="text-4xl md:text-5xl xl:text-5xl font-serif">
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
