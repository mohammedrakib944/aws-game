import io from "socket.io-client";

export const API_BASE_URL = "http://46.137.193.141:8001";

export const socket = io(API_BASE_URL);
