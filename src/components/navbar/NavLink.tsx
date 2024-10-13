"use client";
import useMessageStore from "@/hooks/useMessageStore";
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

  const { unreadCount } = useMessageStore();

  return (
    <NavbarItem isActive={pathName === link} as={Link} href={link}>
      <span>{name}</span>
      {link === "/messages" && <span className="ml-1">({unreadCount})</span>}
    </NavbarItem>
  );
}
