"use client";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { zf } from "@/zod.form";
import { socket } from "@/socket";

const useSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return { isConnected };
};

const useMessages = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const onReceiveMessage = (message: string) => {
      setMessages((v) => [...v, message]);
    };

    socket.on("join", onReceiveMessage);
    socket.on("leave", onReceiveMessage);

    return () => {
      socket.off("join", onReceiveMessage);
      socket.off("leave", onReceiveMessage);
    };
  }, []);

  return { messages };
};

const formSchema = zf.object({
  roomId: zf.string().min(1),
  username: zf.string().min(1),
});

type FormValues = zf.infer<typeof formSchema>;

export default function JoinPage() {
  const { isConnected } = useSocketConnection();
  const { messages } = useMessages();
  const [joined, setJoined] = useState(false);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!joined) {
      socket.emit("join", data);
      setJoined(true);
    } else {
      socket.emit("leave", data);
      setJoined(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      roomId: "",
      username: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onConnectClick = () => {
    socket.connect();
  };

  const onDisconnectClick = () => {
    socket.disconnect();
  };

  const onResetClick = () => {
    socket.emit("reset");
  };

  return (
    <div className="container mx-auto py-32 px-32">
      <div className="flex justify-between pb-8">
        <p>Status: {`${isConnected}`}</p>
        <div className="flex gap-2">
          <Button color="success" onClick={onConnectClick}>
            Connect
          </Button>
          <Button color="danger" onClick={onDisconnectClick}>
            Disconnect
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <Input
            label="Room ID"
            isInvalid={!!errors.roomId}
            errorMessage={errors.roomId?.message}
            {...register("roomId")}
          />
          <Input
            label="Username"
            isInvalid={!!errors.username}
            errorMessage={errors.username?.message}
            {...register("username")}
          />
        </div>
        <div className="pt-8 flex justify-end">
          <Button type="submit" color="primary">
            {joined ? "Leave" : "Join"}
          </Button>
          <Button color="warning" onClick={onResetClick}>
            Reset
          </Button>
        </div>
      </form>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
