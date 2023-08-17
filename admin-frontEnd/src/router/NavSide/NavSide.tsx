import {useState} from "react";
import {Link} from "react-router-dom";

import React from "react";
import SVGComponent from "../../assets/SVGComponent";


type NavSideProps = React.HTMLAttributes<HTMLElement>;

const NavSide: React.FC<NavSideProps> = ({children, ...rest}) => {
  const [selectedLink, setSelectedLink] = useState("");

  const handleLinkClick = (link: string) => {
    setSelectedLink(link);
  };

  const linkClasses =
    "relative flex cursor-pointer space-x-2 rounded-md py-4 px-10 font-semibold hover:bg-slate-600 transition-colors duration-300 ease-in-out";

  return (
    <div className="fixed left-0 top-0 h-full w-64  bg-blue-600  text-white ">
      <h1 className="mt-10 ml-10 text-3xl font-bold ">Dashboard</h1>
      <div className="mt-20 space-y-3">
        <Link
          key="Header"
          to="/Header"
          className={`${linkClasses} ${
            selectedLink === "/AppHeader"
              ? "bg-slate-600 text-white  animate-pulse"
              : ""
          }`}
          onClick={() => handleLinkClick("/Header")}
        >
          <div>
            {selectedLink === "/Header" && <SVGComponent />}
            <span className="">Header</span>
          </div>
        </Link>
        <Link
          key="Hero"
          to="/"
          className={`${linkClasses} ${
            selectedLink === "/" ? "bg-slate-600 text-white  animate-pulse" : ""
          }`}
          onClick={() => handleLinkClick("/")}
        >
          <div>
            {selectedLink === "/" && <SVGComponent />}
            <span className="">Hero</span>
          </div>
        </Link>

        <Link
          key="ProfileAdmin"
          to="/ProfileAdmin"
          className={`${linkClasses} ${
            selectedLink === "/ProfileAdmin"
              ? "bg-slate-600 text-white  animate-pulse"
              : ""
          }`}
          onClick={() => handleLinkClick("/ProfileAdmin")}
        >
          <div>
            {selectedLink === "/ProfileAdmin" && <SVGComponent />}
            <span className="">ProfileAdmin</span>
          </div>
        </Link>

        <Link
          key="Product"
          to="/Product"
          className={`${linkClasses} ${
            selectedLink === "/Product"
              ? "bg-slate-600 text-white  animate-pulse"
              : ""
          }`}
          onClick={() => handleLinkClick("/Product")}
        >
          <div>
            {selectedLink === "/Product" && <SVGComponent />}
            <span className="">Product</span>
          </div>
        </Link>
            <Link
          key="UserList"
          to="/UserList"
          className={`${linkClasses} ${
            selectedLink === "/UserList"
              ? "bg-slate-600 text-white  animate-pulse"
              : ""
          }`}
          onClick={() => handleLinkClick("/UserList")}
        >
          <div>
            {selectedLink === "/UserList" && <SVGComponent />}
            <span className="">UserList</span>
          </div>
        </Link>
        <Link
          key="Category"
          to="/Category"
          className={`${linkClasses} ${
            selectedLink === "/Category"
              ? "bg-slate-600 text-white  animate-pulse"
              : ""
          }`}
          onClick={() => handleLinkClick("/Category")}
        >
          <div>
            {selectedLink === "/Category" && <SVGComponent />}
            <span className="">Category</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NavSide;
