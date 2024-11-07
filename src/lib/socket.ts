import { BACKEND_HOST, BACKEND_PORT } from "astro:env/client";

export const socket = new WebSocket(`ws://${BACKEND_HOST}:${BACKEND_PORT}/ws`);
