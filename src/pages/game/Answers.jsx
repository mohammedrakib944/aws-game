import { useEffect, useRef, useState } from "react";
import CommentCard from "../../components/comment-card";
import { socket } from "../../hooks/base";
import toast from "react-hot-toast";

const Answers = ({ room_number, isOwner, userInfo, answerReceived }) => {
  const [answers, setAnswers] = useState([]);
  const answersRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = e.target[0].value;

    if (!message) {
      toast.error("Please write a message first!");
      return;
    }

    socket.emit("sendAnswer", {
      room_number,
      user_id: userInfo.id,
      username: userInfo.username,
      answer: message,
    });

    e.target[0].value = "";
  };

  useEffect(() => {
    setAnswers([]);
  }, [isOwner]);

  useEffect(() => {
    if (answerReceived) setAnswers((prev) => [...prev, answerReceived]);
  }, [answerReceived]);

  useEffect(() => {
    if (answersRef.current) {
      answersRef.current.scrollTop = answersRef.current.scrollHeight;
    }
  }, [answers]);

  return (
    <div>
      <h2 className="text-xl font-bold pb-1 px-2">Answers</h2>
      <div
        ref={answersRef}
        className="h-[500px] overflow-y-auto scrollbar-hide p-4 rounded-lg border space-y-1.5"
      >
        {answers?.length ? (
          answers.map((answer, index) => (
            <CommentCard
              key={index}
              name={answer?.username}
              comment={answer?.answer}
              variant={answer?.correct ? "success" : null}
            />
          ))
        ) : (
          <div className="flex items-center justify-center">
            <span className="text-gray-400">No Answers found!</span>
          </div>
        )}
      </div>
      {!isOwner && (
        <form className="w-full mt-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Write your guess ..."
            className="w-full input"
          />
        </form>
      )}
    </div>
  );
};

export default Answers;
