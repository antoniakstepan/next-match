import usePresenceStore from "@/hooks/usePresenceStore";
import { Avatar, Badge } from "@nextui-org/react";
import React from "react";

type Props = {
  userId?: string;
  src?: string | null;
};
export default function PresentAvatar({ userId, src }: Props) {
  const { members } = usePresenceStore();

  const isOnline = userId && members.indexOf(userId) !== -1;

  return (
    <Badge content="" color="success" shape="circle" isInvisible={!isOnline}>
      <Avatar src={src || "/images/user.png"} alt="User avatar" />
    </Badge>
  );
}
