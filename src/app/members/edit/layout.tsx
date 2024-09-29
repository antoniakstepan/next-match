import { getMemberByUserId } from "@/app/actions/membersAction";
import React from "react";
import MemberSideBar from "../MemberSideBar";
import { notFound } from "next/navigation";
import { Card } from "@nextui-org/react";
import { getAuthUserId } from "@/app/actions/authAction";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getAuthUserId();
  const member = await getMemberByUserId(userId);
  const basePath = `/members/edit`;
  if (!member) {
    return notFound();
  }

  const navLink = [
    { name: "Edit Profile", href: `${basePath}` },
    { name: "Update Photos", href: `${basePath}/photos` },
  ];
  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh]">
      <div className="col-span-3">
        <MemberSideBar member={member} navLinks={navLink} />
      </div>
      <div className="col-span-9">
        <Card className="w-full mt-10 h-[80vh]">{children}</Card>
      </div>
    </div>
  );
}
