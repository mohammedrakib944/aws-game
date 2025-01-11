import React from "react";

const Navbar = ({ name }) => {
  return (
    <div className="system-width">
      <h2 className="w-fit mx-auto px-7 pt-3 text-2xl font-bold text-blue-600">
        HIDE & SEEK <span className="text-xs font-semibold">{name}</span>
      </h2>
    </div>
  );
};

export default Navbar;
