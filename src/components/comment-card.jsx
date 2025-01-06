const CommentCard = ({ name, comment, variant }) => {
  return (
    <div
      className={`${
        variant === "green" ? "bg-green-100" : "bg-gray-100"
      } px-3 py-2 rounded space-y-1 shadow-inner border border-black/20`}
    >
      <p className="text-sm leading-none">{name}</p>
      <p className="font-semibold leading-normal">{comment}</p>
    </div>
  );
};

export default CommentCard;
