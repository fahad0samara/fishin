/* eslint-disable @typescript-eslint/ban-ts-comment */
import {useDispatch} from "react-redux";
import {useSelector} from "react-redux";
import {toggleDarkMode} from "../Redux/Darkmode/darkModeSlice";
import {RootState} from "../Redux/store";
import {FaMoon, FaSun} from "react-icons/fa";
const DarkModeToggle = () => {
  const isDarkMode = useSelector((state: RootState) => state.darkmode.darkmode);
  const dispatch = useDispatch();

  const handleToggle = () => {
    //@ts-ignore
    dispatch(toggleDarkMode(isDarkMode ? false : true));
  };

  return (
    <button
      onClick={handleToggle}
      className={`fixed bottom-4 right-4 z-50 ${
        isDarkMode ? "bg-black" : "bg-white"
      } px-3 py-2 rounded-full focus:outline-none focus:shadow-outline 
        ${isDarkMode ? "text-yellow-500" : "text-gray-500"}`}
    >
      {isDarkMode ? (
        <FaSun className="text-yellow-500 text-xl" />
      ) : (
        <FaMoon className="text-gray-500 text-xl" />
      )}
    </button>
  );
};

export default DarkModeToggle;
