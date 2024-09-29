import { Prisma } from "@prisma/client";
import { ZodIssue } from "zod";

export type ActionResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string | ZodIssue[] };

type MessageWithSenderRecipient = Prisma.MessageGetPayload<{
  select: {
    id: true;
    created: true;
    dateRead: true;
    text: true;
    sender: { select: { userId; name; image } };
    recipient: { select: { userId; name; image } };
  };
}>;

type messageDTO = {
  id: string;
  text: string;
  created: string;
  dateRead: string | null;
  senderId?: string;
  senderName?: string;
  senderImage?: string | null;
  recipientId?: string;
  recipientName?: string;
  recipientImage?: string | null;
};
