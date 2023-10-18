"use client";
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { sharedConfig } from "@/shared-config";

const ns = [1, 2, 3, 5, 8, 13, 20, 40, 100];

type Votes = Record<string, number>;

type Props = {
  params: {
    roomId: string;
    username: string;
  };
};

export default function JoinPage({ params: { roomId, username } }: Props) {
  const socket = io(sharedConfig.socketBaseUrl, {
    auth: {
      roomId,
      username,
    },
  });

  const [connected, setConnected] = useState(socket.connected);
  const [votes, setVotes] = useState<Votes>({});

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    const onDecided = (vs: Votes) => {
      setVotes(vs);
    };

    const onStart = () => {
      setVotes({});
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("decided", onDecided);
    socket.on("start", onStart);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("decided", onDecided);
      socket.off("reset", onStart);
    };
  }, [socket]);

  const onCardClick = (n: number) => {
    socket.emit("vote", n);
  };

  return (
    <div className="container mx-auto py-32 px-32">
      <div className="flex gap-8">
        <p className="text-2xl">Room Id: {roomId}</p>
        <p className="text-2xl">Username: {username}</p>
        <p className="text-2xl">Status: {`${connected}`}</p>
      </div>
      <div>
        <p className="text-lg">Votes</p>
        <ul>
          {Object.entries(votes).map(([username, n]) => (
            <li key={username}>{`${username}: ${n}`}</li>
          ))}
        </ul>
      </div>
      <div>
        {ns.map((n) => (
          <Button
            key={n}
            color="primary"
            isDisabled={votes !== undefined}
            onClick={() => onCardClick(n)}
          >
            {n}
          </Button>
        ))}
      </div>
    </div>
  );
}
