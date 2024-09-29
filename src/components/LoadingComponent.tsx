import { Spinner } from "@nextui-org/react";
import React from "react";

export default function LoadingComponent({ label }: { label?: string }) {
  return (
    <div className="fixed h-screen flex justify-center items-start w-full">
      <Spinner
        label={label || "Loading ..."}
        color="secondary"
        labelColor="secondary"
        size="lg"
      />
    </div>
  );
}
