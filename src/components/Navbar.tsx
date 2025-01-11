import React from "react";
import { NavLink } from "react-router";

const Navbar = ({ name }) => {
  return (
    <div className="system-width">
      <NavLink to="/">
        <h2 className="w-fit mx-auto px-7 pt-3 text-2xl font-bold text-blue-600">
          HIDE & SEEK <span className="text-xs font-semibold">{name}</span>
        </h2>
      </NavLink>
    </div>
  );
};

export default Navbar;
