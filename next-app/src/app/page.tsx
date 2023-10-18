"use client";
import { sharedConfig } from "@/shared-config";
import { socket } from "@/socket";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { SubmitHandler, useForm } from "react-hook-form";

const createRoom = async () => {
  await fetch(sharedConfig.socketBaseUrl + "/room", {
    method: "post",
  });
};

const onCreateRoomClick = async () => {
  await createRoom();
};

export default function Home() {
  return (
    <main className="container mx-auto min-h-screen p-32">
      <h1 className="text-5xl font-bold">Planning Poaker</h1>
      <div className="pt-12">
        <Button color="primary" onClick={onCreateRoomClick}>
          Create Room
        </Button>
      </div>
    </main>
  );
}
