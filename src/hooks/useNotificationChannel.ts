import { usePathname, useSearchParams } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { messageDTO } from "@/types";
import { Channel } from "pusher-js";
import { useCallback, useEffect, useRef } from "react";
import useMessageStore from "./useMessageStore";
import { toast } from "react-toastify";
import { newMessageToast } from "@/components/NewMessageToast";
import { newLikeToast } from "@/components/NotificationToast";

export const useNotificationChannel = (userId: string | null) => {
  const channelRef = useRef<Channel | null>(null);
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { add, updateUnreadCount } = useMessageStore();

  const handleNewMessage = useCallback(
    (message: messageDTO) => {
      console.log("ass");
      if (
        pathName === "/messages" &&
        searchParams.get("container") !== "outbox"
      ) {
        add(message);
        updateUnreadCount(1);
      } else if (pathName !== `/members/${message.senderId}/chat`) {
        newMessageToast(message);
        updateUnreadCount(1);
      }
    },
    [pathName, searchParams, add, updateUnreadCount]
  );

  const handleNewLike = useCallback(
    (data: { name: string; image: string | null; userId: string }) => {
      newLikeToast(data.name, data.image, data.userId);
    },
    []
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe(`private-${userId}`);
      channelRef.current.bind("message:new", handleNewMessage);
      channelRef.current.bind("like:new", handleNewLike);
    }

    return () => {
      if (channelRef.current && channelRef.current.subscribed) {
        channelRef.current.unsubscribe();
        channelRef.current.unbind("message:new", handleNewMessage);
        channelRef.current.unbind("like:new", handleNewLike);
        channelRef.current = null;
      }
    };
  }, [userId, handleNewMessage, handleNewLike]);
};
