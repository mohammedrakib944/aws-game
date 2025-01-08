import { useEffect, useRef, useState } from "react";
import CommentCard from "../../components/comment-card";
import { socket } from "../../hooks/base";
import toast from "react-hot-toast";

const Hints = ({ room_number, isOwner, hintsReceived }) => {
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
      <h2 className="text-xl font-bold pb-1 text-center">Hints</h2>
      <div
        ref={messageRef}
        className="h-[500px] overflow-y-auto scrollbar-hide p-4 rounded-lg border space-y-1.5"
      >
        {messages?.length &&
          messages.map((message, index) => (
            <CommentCard key={index} comment={message} variant="blue" />
          ))}
      </div>
      {!isOwner && (
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
