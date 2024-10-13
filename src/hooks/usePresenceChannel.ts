import { useCallback, useEffect, useRef } from "react";
import usePresenceStore from "./usePresenceStore";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "@/lib/pusher";

export const usePresenceChannel = () => {
  const { set, add, remove } = usePresenceStore((state) => {
    return state;
  });
  const channelRef = useRef<Channel | null>(null);

  const handleSetMembers = useCallback(
    (members: Members) => {
      const memberIds = Object.keys(members.members);
      set(memberIds);
    },
    [set]
  );

  const handleAddMember = useCallback(
    (member: Record<string, any>) => {
      add(member.id);
    },
    [add]
  );

  const handleRemoveMember = useCallback(
    (member: Record<string, any>) => {
      remove(member.id);
    },
    [remove]
  );

  useEffect(() => {
    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe("presence-nm");
      channelRef.current.bind(
        "pusher:subscription_succeeded",
        (members: Members) => {
          handleSetMembers(members);
        }
      );
      channelRef.current.bind(
        "pusher:member_added",
        (member: Record<string, any>) => handleAddMember(member)
      );
      channelRef.current.bind(
        "pusher:member_removed",
        (member: Record<string, any>) => handleRemoveMember(member)
      );
    }
    return () => {
      if (channelRef.current && channelRef.current.subscribed) {
        channelRef.current.unsubscribe();
        channelRef.current.unbind(
          "pusher:subscription_succeeded",
          handleSetMembers
        );
        channelRef.current.unbind("pusher:member_added", handleAddMember);
        channelRef.current.unbind("pusher:member_removed", handleRemoveMember);
      }
    };
  }, [handleSetMembers, handleAddMember, handleRemoveMember]);
};
