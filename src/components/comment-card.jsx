const CommentCard = ({ name, comment, variant }) => {
  return (
    <div
      className={`${
        variant === "green" ? "bg-green-100" : "bg-gray-100"
      } p-3 rounded space-y-1 shadow border border-black/20`}
    >
      <p className="text-sm leading-none">{name}</p>
      <p className="text-lg font-semibold leading-normal">{comment}</p>
    </div>
  );
};

export default CommentCard;
