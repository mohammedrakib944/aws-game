import { useEffect, useRef, useState } from "react";
import { socket } from "../../hooks/base";
import toast from "react-hot-toast";

const Hints = ({ room_number, isOwner, hintsReceived, reset }) => {
  const [messages, setMessages] = useState([]);
  const messageRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = e.target[0].value;

    if (!message) {
      toast.error("Please write a message first!");
      return;
    }

    socket.emit("sendHint", {
      room_number,
      hint: message,
    });

    e.target[0].value = "";
  };
  useEffect(() => {
    if (reset) setMessages([]);
  }, [reset]);

  useEffect(() => {
    if (hintsReceived?.hint)
      setMessages((prev) => [...prev, hintsReceived.hint]);
  }, [hintsReceived]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <h2 className="text-xl font-bold pb-1 px-2">Hints</h2>
      <div
        ref={messageRef}
        className="h-[500px] overflow-y-auto scrollbar-hide rounded-lg border"
      >
        {messages?.length ? (
          messages.map((message, index) => (
            <div key={index} className="px-4 py-2 font-semibold border-b">
              {message}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center">
            <span className="text-gray-400 py-4">No hints found!</span>
          </div>
        )}
      </div>
      {isOwner && (
        <form className="w-full mt-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Give hints ..."
            className="w-full input"
          />
        </form>
      )}
    </div>
  );
};

export default Hints;
