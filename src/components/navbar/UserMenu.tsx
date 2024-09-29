"use client";

import { signOutUser } from "@/app/actions/authAction";
import { transformImageUrl } from "@/lib/util";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import { Session } from "next-auth";
import Link from "next/link";
import React from "react";

type Props = {
  user: { name: string | null; image: string | null } | null;
};

export default function UserMenu({ user }: Props) {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as={"button"}
          className="transition-transform"
          color="secondary"
          name={user?.image || "user"}
          size="sm"
          src={transformImageUrl(user?.image) || "/images/user.png"}
        />
      </DropdownTrigger>
      <DropdownMenu variant="flat" aria-label="User action menu">
        <DropdownSection showDivider>
          <DropdownItem
            isReadOnly
            as="span"
            className="h-14 flex flex-row"
            aria-label="User name"
          >
            Sign in as {user?.name}
          </DropdownItem>
          <DropdownItem as={Link} href="/members/edit">
            Edit profile
          </DropdownItem>
          <DropdownItem
            color="danger"
            onClick={async () => {
              await signOutUser();
            }}
          >
            Log out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
