import { io } from "socket.io-client";
import { sharedConfig } from "./shared-config";

export const socket = io(sharedConfig.socketBaseUrl, {
  autoConnect: false,
});
