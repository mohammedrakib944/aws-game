const CommentCard = ({ name, comment, variant }) => {
  return (
    <div
      className={`${
        variant === "success"
          ? "bg-green-600 text-white"
          : "bg-gray-50 text-black"
      } px-3 py-1.5 rounded space-y-1 shadow-inner border border-black/20`}
    >
      {name && <p className="text-sm leading-none">{name}</p>}
      <p className="font-semibold leading-normal">{comment}</p>
    </div>
  );
};

export default CommentCard;
