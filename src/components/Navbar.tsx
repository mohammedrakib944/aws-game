// @ts-nocheck
import React from "react";
import Logo from "../assets/Logo.svg";

const Navbar = ({ name }) => {
  return (
    <div className="system-width">
      <h2 className="w-fit mx-auto px-7 pt-3 text-2xl font-bold text-blue-600 flex items-end">
        <img src={Logo} className="w-[200px]" />
        <p className="text-xs font-semibold pl-1 pt-2 -mb-0.5">{name}</p>
      </h2>
    </div>
  );
};

export default Navbar;
