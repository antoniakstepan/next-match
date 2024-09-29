import { getMemberByUserId } from "@/app/actions/membersAction";
import React from "react";
import MemberSideBar from "../MemberSideBar";
import { notFound } from "next/navigation";
import { Card } from "@nextui-org/react";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string };
}) {
  const member = await getMemberByUserId(params.userId);

  if (!member) {
    return notFound();
  }

  const basePath = `/members/${member.userId}`;
  const navLink = [
    { name: "Profile", href: `${basePath}` },
    { name: "Photos", href: `${basePath}/photos` },
    { name: "Chat", href: `${basePath}/chat` },
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
