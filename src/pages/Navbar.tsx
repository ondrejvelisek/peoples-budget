import { Button, Code, NavLink, Title } from "@mantine/core";
import { type FC } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

export const Navbar: FC = () => {
  return (
    <nav>
      <NavLink label="Navlink" className="bg-red-300">
        <NavLink label="Navlink nested" />
        <NavLink label="Navlink nested" />
        <NavLink label="Navlink nested" />
      </NavLink>
      <NavLink label="Navlink">
        <NavLink label="Navlink nested" />
        <NavLink label="Navlink nested" />
        <NavLink label="Navlink nested" />
      </NavLink>
      <NavLink label="Navlink">
        <NavLink label="Navlink nested" />
        <NavLink label="Navlink nested" />
        <NavLink label="Navlink nested" />
      </NavLink>
      <Button color="red" variant="gradient">
        Textd
      </Button>
      <Title order={1}>Heading One</Title>
      <p>Paragraph lorem ipsum paragraph</p>
      <Title order={2}>Heading One</Title>
      <p className="text-red-400">
        PPParagraph <FaArrowLeftLong className="inline" /> lorem ipsum paragraph
      </p>
      <Code>Monaco, Courier Code</Code>
      <Title order={3}>Heading One</Title>
      <p>Paragraph lorem ipsum paragraph</p>
      <Title order={4}>Heading One</Title>
      <p>Paragraph lorem ipsum paragraph</p>
      <Code>Monaco, Courier Code</Code>
      <Title order={5}>Heading One</Title>
      <p>Paragraph lorem ipsum paragraph</p>
      <Title order={6}>Heading One</Title>
      <p>Paragraph lorem ipsum paragraph</p>
      <Code>Monaco, Courier Code</Code>
    </nav>
  );
};
