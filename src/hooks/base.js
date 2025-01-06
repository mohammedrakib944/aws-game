import io from "socket.io-client";

export const API_BASE_URL = "http://localhost:8000";

export const socket = io(API_BASE_URL);
