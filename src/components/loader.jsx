import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return <span className="font-semibold">{text}</span>;
};

export default Loader;
