import io from "socket.io-client";

export const API_BASE_URL = "http://13.239.140.245:8000";

export const socket = io(API_BASE_URL);
