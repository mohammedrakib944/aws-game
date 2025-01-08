import React from "react";
import { NavLink } from "react-router";

const Navbar = () => {
  return (
    <div className="system-width">
      <NavLink to="/">
        <h2 className="w-fit mx-auto px-7 pt-3 text-2xl font-bold text-blue-600">
          HIDE & SEEK
        </h2>
      </NavLink>
    </div>
  );
};

export default Navbar;
