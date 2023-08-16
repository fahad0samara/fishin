import React, { useState } from "react";
import { useSelector } from "react-redux";
import NavSide from "./NavSide";
import { RiCloseLine, RiMenuLine } from "react-icons/ri";
import { RootState } from "../../Redux/store";



const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const { isAdmin } = useSelector((state: RootState) => state.auth);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="flex h-screen ">
      {isAdmin && isNavOpen && <NavSide />}
      <div
        className={` 
        w-[100%] ${
          isNavOpen ? "lg:ml-64" : "lg:ml-0"
        }
        
        flex flex-col flex-1 
        transition-all duration-300 ease-in-out

   
        `}
      >
        {isAdmin && ( // Conditionally render the button for admin users
          <button
            className={`fixed top-5 left-5 bg-blue-500 text-white py-2 px-4 rounded-full focus:outline-none z-50 transition-colors duration-300 ease-in-out ${
              isNavOpen ? "hover:bg-blue-600" : "hover:bg-blue-400"
            }`}
            onClick={toggleNav}
          >
            {isNavOpen ? (
              <RiCloseLine className="text-2xl" />
            ) : (
              <RiMenuLine className="text-2xl" />
            )}
          </button>
        )}
        <div
          className={`transition-opacity duration-300 ease-in-out ${
            isNavOpen ? "opacity-100" : ""
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
