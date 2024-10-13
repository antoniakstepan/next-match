import PresentAvatar from "@/components/PresentAvatar";
import { truncateString } from "@/lib/util";
import { messageDTO } from "@/types";
import { Button } from "@nextui-org/react";
import React from "react";
import { AiFillDelete } from "react-icons/ai";

type Props = {
  item: messageDTO;
  columnKey: string;
  isOutbox: boolean;
  deleteMessage: (message: messageDTO) => void;
  isDeleting: boolean;
};

export default function MessageTableCell({
  item,
  columnKey,
  isOutbox,
  deleteMessage,
  isDeleting,
}: Props) {
  const cellValue = item[columnKey as keyof messageDTO];

  switch (columnKey) {
    case "recipientName":
    case "senderName":
      return (
        <div className={`flex items-center gap-2 cursor-pointer`}>
          <PresentAvatar
            userId={isOutbox ? item.recipientId : item.senderId}
            src={isOutbox ? item.recipientImage : item.senderImage}
          />
          <span>{cellValue}</span>
        </div>
      );
    case "text":
      return <div className="truncate">{truncateString(cellValue, 80)}</div>;
    case "created":
      return cellValue;
    default:
      return (
        <Button
          onClick={() => deleteMessage(item)}
          isIconOnly
          variant="light"
          isLoading={isDeleting}
        >
          <AiFillDelete size={24} className="text-danger" />
        </Button>
      );
  }
}
