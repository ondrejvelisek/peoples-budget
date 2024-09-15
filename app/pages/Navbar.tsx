import { Button } from "@/components/ui/button";
import { type FC } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

export const Navbar: FC = () => {
  return (
    <nav>
      <Button>Home</Button>
      <Button color="green">Blog</Button>
      <p>
        Paragraph <FaArrowLeftLong />
        lorem ipsum paragraph
      </p>
    </nav>
  );
};
