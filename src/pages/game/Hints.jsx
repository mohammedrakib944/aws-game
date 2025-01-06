import CommentCard from "../../components/comment-card";

const Hints = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("HI");
  };

  return (
    <div>
      <h2 className="text-xl font-bold pb-1 text-center">Hints</h2>
      <div className="h-[500px] p-4 rounded-lg border space-y-1.5">
        <CommentCard name="Rakib" comment="Nothing to say" variant="green" />
        <CommentCard name="Rakib" comment="Lot's of thing to say" />
      </div>
      <form className="w-full mt-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Give hints ..."
          className="w-full input"
        />
      </form>
    </div>
  );
};

export default Hints;
