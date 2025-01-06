import CommentCard from "../../components/comment-card";

const Answers = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("HI");
  };
  return (
    <div>
      <h2 className="text-xl font-bold pb-1 text-center">Answers</h2>
      <div className="h-[500px] p-4 rounded-lg border space-y-1.5">
        <CommentCard name="Tomal" comment="Bangladesh" />
        <CommentCard name="Polok" comment="Banglore" />
      </div>
      <form className="w-full mt-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your answer ..."
          className="w-full input"
        />
      </form>
    </div>
  );
};

export default Answers;
