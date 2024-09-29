import { getMemberByUserId } from "@/app/actions/membersAction";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import { CardBody, CardHeader, Divider } from "@nextui-org/react";
import { notFound } from "next/navigation";
import React from "react";

export default async function MemberDetailPage({
  params,
}: {
  params: { userId: string };
}) {
  const member = await getMemberByUserId(params.userId);

  if (!member) {
    return notFound();
  }
  return (
    <>
      <CardInnerWrapper
        header="Profile"
        body={<div>{member.description}</div>}
      />
    </>
  );
}
