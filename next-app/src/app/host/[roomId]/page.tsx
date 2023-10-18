import { sharedConfig } from "@/shared-config";

type Props = {
  params: {
    roomId: string;
  };
};

export default function HostPage({ params: { roomId } }: Props) {
  return (
    <main className="container mx-auto min-h-screen p-32">
      <h1 className="text-5xl font-bold">Host</h1>
      <a>{`${sharedConfig.socketBaseUrl}/join/${roomId}`}</a>
    </main>
  );
}
