import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch, RootState} from "../Redux/store";
import {
  FaBars,
  FaRegTimesCircle,
  FaTachometerAlt,
  FaBox,
  FaBoxOpen,
  FaUserFriends,
} from "react-icons/fa";
import {IoMdAddCircleOutline} from "react-icons/io";
import {useSelector} from "react-redux";
import {useDarkMode} from "../hook/useDarkMode";
import {logout} from "../auth/authThunks";

const Sidebar = () => {
  const isDarkMode = useDarkMode();
  const {user} = useSelector((state: RootState) => state.auth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logout());

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64
        transition-all duration-300 ease-in-out border-r-2 border-green-500
        ${isSidebarOpen ? "ml-0 z-10" : "-ml-64 z-0 "}
        ${isDarkMode ? "bg-gray-900" : "bg-white"}
        `}
    >
      <div
        className={`flex items-center justify-end h-12 text-white bg-green-500 shadow-md`}
      >
        <button
          className=" focus:outline-none rounded-br-lg ml-auto mr-4 transition-colors duration-300 ease-in-out"
          onClick={handleToggleSidebar}
        >
          {isSidebarOpen ? (
            <FaRegTimesCircle className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      {isSidebarOpen && (
        <div
          className="flex h-full flex-grow flex-col overflow-y-auto rounded-br-lg
            shadow-md"
        >
          <div className="flex mt-5 items-center px-4">
            <div className="flex ml-3 space-y-2  flex-col">
              <h3 className="font-medium ">
                Welcome
                <br />
                {user?.firstName} {user?.lastName}
              </h3>

              <h2 className="text-lg italic">{user?.email}</h2>
            </div>
          </div>

          <span className="ml-3 mt-10 mb-2 block text-xs font-semibold text-green-500">
            Analytics
          </span>

          <div className="flex mt-3 flex-1 flex-col ">
            <div className="space-y-7">
              <nav className="flex-1">
                <Link
                  to="/"
                  title=""
                  className="flex cursor-pointer items-center border-l-4 border-l-green-600 py-2 px-4 text-sm font-medium text-green-500 outline-none transition-all duration-100 ease-in-out focus:border-l-4"
                >
                  <FaTachometerAlt className="mr-4 h-5 w-5 align-middle" />
                  Dashboard
                </Link>
              </nav>

              <span className="ml-3 mt-10 mb-2 block text-xs font-semibold text-green-500">
                Product Management
              </span>

              <nav className="flex-1 space-y-6">
                <Link
                  to="/AddMenuItem"
                  className="flex cursor-pointer items-center border-l-green-600 py-2 px-4 text-sm font-medium  outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:border-l-green-600 hover:text-green-500 focus:border-l-4"
                >
                  <IoMdAddCircleOutline className="mr-4 h-5 w-5 align-middle" />
                  Add Menu
                </Link>
                <Link
                  to="/ListMenu"
                  className="flex cursor-pointer items-center border-l-green-600 py-2 px-4 text-sm font-medium  outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:border-l-green-600 hover:text-green-500 focus:border-l-4"
                >
                  <FaBox className="mr-4 h-5 w-5 align-middle" />
                  List Menu
                </Link>

                <Link
                  to="/OrderList"
                  className="flex cursor-pointer items-center border-l-green-600 py-2 px-4 text-sm font-medium  outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:border-l-green-600 hover:text-green-500 focus:border-l-4"
                >
                  <FaBoxOpen className="mr-4 h-5 w-5 align-middle" />
                  Orders
                </Link>
                <Link
                  to="/UserManagement"
                  className="flex cursor-pointer items-center border-l-green-600 py-2 px-4 text-sm font-medium  outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:border-l-green-600 hover:text-green-500 focus:border-l-4"
                >
                  <FaUserFriends className="mr-4 h-5 w-5 align-middle" />
                  Suppliers
                </Link>
              </nav>
            </div>
          </div>
          <div className="mb-20 text-center">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
      {!isSidebarOpen && (
        <button
          className="fixed top-5 left-6 
               text-white
               bg-green-500 hover:bg-green-800 
               focus:outline-none ml-auto mr-4
               rounded-md shadow-lg px-4 py-2
               transition-all duration-200"
          onClick={handleToggleSidebar}
        >
          <FaBars className="text-2xl" />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
