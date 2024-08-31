"use client";
import { NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  name: string;
  link: string;
};

export default function NavLink({ name, link }: Props) {
  const pathName = usePathname();
  return (
    <NavbarItem isActive={pathName === link} as={Link} href={link}>
      {name}
    </NavbarItem>
  );
}
