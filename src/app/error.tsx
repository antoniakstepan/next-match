"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { error } from "console";
import { BiSolidError } from "react-icons/bi";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center vertical-center h-[calc(100vh_-_64px)]">
      <Card className="w-2/5 mx-auto">
        <CardHeader className="flex flex-col items-center justify-center">
          <div className="flex flex-row gap-2 items-center text-secondary">
            <BiSolidError size={30} />
            <h1 className="text-3xl font-semibold">Error</h1>
          </div>
        </CardHeader>
        <CardBody className="flex justify-center text-danger w-full text-center">
          <div>{error.message}</div>
        </CardBody>
        <CardFooter className="flex justify-center">
          <Button onClick={() => reset()} color="secondary" variant="bordered">
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
