"use server";

import { messageSchema, MessageSchema } from "@/lib/schemas/messageSchema";
import { ActionResult } from "@/types";
import { Message } from "@prisma/client";
import { getAuthUserId } from "./authAction";
import { prisma } from "@/lib/prisma";
import { mapMessageToMessageDTO } from "@/lib/mapping";

export async function createMessage(
  recipientUserId: string,
  data: MessageSchema
): Promise<ActionResult<Message>> {
  try {
    const userId = await getAuthUserId();

    const validated = messageSchema.safeParse(data);

    if (!validated.success) {
      return { status: "error", error: validated.error.message };
    }

    const { text } = validated.data;

    const message = await prisma.message.create({
      data: {
        text,
        recipientId: recipientUserId,
        senderId: userId,
      },
    });

    return {
      status: "success",
      data: message,
    };
  } catch (error) {
    console.log("Send message error: ", error);
    return {
      status: "error",
      error: "Something went wrong",
    };
  }
}

export async function getMessageThread(recipientUserId: string) {
  try {
    const userId = await getAuthUserId();

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            recipientId: recipientUserId,
            senderDeleted: false,
          },
          {
            senderId: recipientUserId,
            recipientId: userId,
            recipientDeleted: false,
          },
        ],
      },
      orderBy: {
        created: "asc",
      },
      select: {
        id: true,
        text: true,
        created: true,
        dateRead: true,
        sender: {
          select: {
            userId: true,
            name: true,
            image: true,
          },
        },
        recipient: {
          select: {
            userId: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (messages.length > 0) {
      await prisma.message.updateMany({
        where: {
          senderId: recipientUserId,
          recipientId: userId,
          dateRead: null,
        },
        data: {
          dateRead: new Date(),
        },
      });
    }

    return messages.map((message) => mapMessageToMessageDTO(message));
  } catch (error) {
    console.log("Get messages error: ", error);
    throw error;
  }
}

export const getMessagesByContainer = async (container: string) => {
  try {
    const userId = await getAuthUserId();
    const selector = container === "outbox" ? "senderId" : "recipientId";

    const conditions = {
      [container === "outbox" ? "senderId" : "recipientId"]: userId,
      ...(container === "outbox"
        ? { senderDeleted: false }
        : { recipientDeleted: false }),
    };

    const messages = await prisma.message.findMany({
      where: conditions,
      orderBy: {
        created: "desc",
      },
      select: {
        id: true,
        text: true,
        created: true,
        dateRead: true,
        sender: {
          select: {
            userId: true,
            name: true,
            image: true,
          },
        },
        recipient: {
          select: {
            userId: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return messages.map((message) => mapMessageToMessageDTO(message));
  } catch (error) {
    console.log("Get messages by container error: ", error);
    throw error;
  }
};

export const deleteMessage = async (messageId: string, isOutBox: boolean) => {
  const selector = isOutBox ? "senderDeleted" : "recipientDeleted";

  try {
    const userId = await getAuthUserId();
    await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        [selector]: true,
      },
    });

    const messagesToDelete = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, senderDeleted: true, recipientDeleted: true },
          { recipientId: userId, senderDeleted: true, recipientDeleted: true },
        ],
      },
    });

    if (messagesToDelete.length > 0) {
      await prisma.message.deleteMany({
        where: {
          OR: messagesToDelete.map((m) => ({ id: m.id })),
        },
      });
    }
  } catch (error) {
    console.log("Delete message error: ", error);
  }
};
