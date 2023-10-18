"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { SubmitHandler, useForm } from "react-hook-form";

import { sharedConfig } from "@/shared-config";
import { zf } from "@/zod.form";

const askJoin = async ({
  roomId,
  username,
}: {
  roomId: string;
  username: string;
}) =>
  await fetch(sharedConfig.socketBaseUrl + "/join", {
    method: "post",
    body: JSON.stringify({ roomId, username }),
  });

const formSchema = zf.object({
  roomId: zf.string().min(1),
  username: zf.string().min(1),
});

type FormValues = zf.infer<typeof formSchema>;

type Props = {
  params: {
    roomId: string;
  };
};

export default function JoinPage({ params: { roomId } }: Props) {
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await askJoin(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      roomId,
      username: "",
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="container mx-auto py-32 px-32">
      <h1 className="text-5xl font-bold">Join Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <Input label="Room ID" isReadOnly={true} {...register("roomId")} />
          <Input
            label="Username"
            isInvalid={!!errors.username}
            errorMessage={errors.username?.message}
            {...register("username")}
          />
        </div>
        <div className="pt-8 flex justify-end">
          <Button type="submit" color="primary">
            Join
          </Button>
        </div>
      </form>
    </div>
  );
}
