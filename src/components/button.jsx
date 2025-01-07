const Button = ({ disabled, children, ...props }) => {
  return (
    <button
      disabled={disabled}
      {...props}
      className="bg-primary hover:bg-primary/90 text-white duration-200 px-6 py-2 font-bold rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
};

export default Button;
