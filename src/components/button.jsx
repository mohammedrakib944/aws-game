import React from "react";

const Button = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="bg-primary hover:bg-primary/90 text-white duration-200 px-6 py-2 font-bold rounded-lg"
    >
      {children}
    </button>
  );
};

export default Button;
