"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { messageDTO } from "@/types";
import { pusherClient } from "@/lib/pusher";
import { formatShortDateTime } from "@/lib/util";
import { Channel } from "pusher-js";
import useMessageStore from "@/hooks/useMessageStore";

type Props = {
  initialMessages: { messages: messageDTO[]; readCount: number };
  userId: string;
  chatId: string;
};

export default function MessageList({
  initialMessages,
  userId,
  chatId,
}: Props) {
  const setReadCount = useRef(false);
  const [messages, setMessages] = useState(initialMessages.messages);
  const chanelRef = useRef<Channel | null>(null);
  const { updateUnreadCount } = useMessageStore();

  useEffect(() => {
    if (!setReadCount.current) {
      updateUnreadCount(-initialMessages.readCount);
      setReadCount.current = true;
    }
  }, [initialMessages.readCount, updateUnreadCount]);

  const handleNewMessage = useCallback((message: messageDTO) => {
    setMessages((prevState) => {
      return [...prevState, message];
    });
  }, []);

  const handleReadMassages = useCallback((messageIds: string[]) => {
    setMessages((prevState) =>
      prevState.map((message) =>
        messageIds.includes(message.id)
          ? { ...message, dateRead: formatShortDateTime(new Date()) }
          : message
      )
    );
  }, []);

  useEffect(() => {
    if (!chanelRef.current) {
      chanelRef.current = pusherClient.subscribe(chatId);
      chanelRef.current.bind("message:new", handleNewMessage);
      chanelRef.current.bind("messages:read", handleReadMassages);
    }

    return () => {
      if (chanelRef.current && chanelRef.current.subscribed) {
        chanelRef.current.unsubscribe();
        chanelRef.current.unbind("message:new", handleNewMessage);
        chanelRef.current.unbind("messages:read", handleReadMassages);
      }
    };
  }, [chatId, handleNewMessage, handleReadMassages]);

  return (
    <div>
      {messages.length === 0 ? (
        "No message to display"
      ) : (
        <div>
          {messages.map((message) => (
            <MessageBox
              key={message.id}
              message={message}
              currentUserId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
