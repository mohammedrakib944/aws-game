const Button = ({ disabled, children, ...props }) => {
  return (
    <button
      disabled={disabled}
      {...props}
      className="bg-blue-600 hover:bg-blue-700 text-white duration-200 px-6 py-2 font-bold rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
};

export default Button;
