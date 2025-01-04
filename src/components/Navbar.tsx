import React from "react";
import { NavLink } from "react-router";

const Navbar = () => {
  return (
    <div>
      <div>
        <NavLink to="/">
          <h2 className="px-7 pt-3">Logo</h2>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
