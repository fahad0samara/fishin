import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { updateProfile, fetchUserData } from "../auth/authThunks";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import avatar from '../assets/avatar.png'

const Profile = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading,setloading]=useState(false);

  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("orders");
  const [isFirstUpdate, setIsFirstUpdate] = useState(true);
  const [updateData, setUpdateData] = useState({
    name: user.name,
    email: user.email,
    newProfileImage: null,
    deleteProfileImage: false,
  });

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const handleOpenUpdateModal = () => {
    setUpdateModalOpen(true);
  };

  const handleCloseUpdate = () => {
    setUpdateModalOpen(false);
    setUpdateData({
      name: user.name,
      email: user.email,
      newProfileImage: null,
      deleteProfileImage: false,
    });
  };

  const handleUpdate = async () => {
    setloading(true)
    const profileData = {
      name: updateData.name,
      email: updateData.email,
      newProfileImage: updateData.newProfileImage,
      deleteProfileImage: updateData.deleteProfileImage,
    };

    // Conditionally dispatch the update action based on isFirstUpdate
    if (isFirstUpdate) {
      await dispatch(updateProfile({ userId: user.id, user: profileData }));
      setloading(false)

    } else {
      await dispatch(updateProfile({ userId: user._id, user: profileData }));
      setloading(false)

    }

    setIsFirstUpdate(false);
    handleCloseUpdate();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUpdateData({
        ...updateData,
        newProfileImage: e.target.files[0],
      });
    }
  };

const handleDeleteImage = () => {
  // Revoke the object URL to release resources
  if (updateData.newProfileImage) {
    URL.revokeObjectURL(URL.createObjectURL(updateData.newProfileImage));
  }

  setUpdateData({
    ...updateData,
    newProfileImage: null,
    deleteProfileImage: true,
  });
};

const handleAddImage = () => {
  setUpdateData({
    ...updateData,
    deleteProfileImage: false, // Clear the delete flag
  });
};



  const renderContent = () => {
    if (activeSection === "orders") {
      return (
        <div className="p-4">
          {/* Content for Orders section */}
          <h2 className="text-2xl font-semibold mb-4">Orders</h2>
          <p>Your recent orders and order history will be displayed here.</p>
        </div>
      );
    } else if (activeSection === "favorites") {
      return (
        <div className="p-4">
          {/* Content for Favorites section */}
          <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
          <p>Your favorite items and products will be displayed here.</p>
        </div>
      );
    }
  };

  return (
    <section className="pt-16">
      <div className="w-full lg:w-9/12 px-4 mx-auto">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
          <div className="px-6">
            <div className="flex flex-wrap justify-start gap-x-4 mb-4">
              {/* Update Profile Button */}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold transition duration-300 hover:bg-blue-600"
                onClick={handleOpenUpdateModal}
              >
                Update Profile
              </button>
            </div>
            {/* User Profile Image */}
 {/* User Profile Image */}
<div className="flex justify-center">
  {user.profileImage ? (
    <img
      src={user.profileImage}
      alt="Profile"
      className="shadow-xl rounded-full h-auto align-middle border-none -mt-12 w-32 h-32"
    />
  ) : (
     <div className="relative mx-auto w-36 rounded-full">
      <span className="absolute right-0 m-3 h-3 w-3 rounded-full bg-green-500 ring-2 ring-green-300 ring-offset-2"></span>
      <img className="mx-auto h-auto w-full rounded-full"
      src={avatar}
      
       alt="" />
    </div>
  )}
</div>

            {/* User Information */}
            <div className="text-center">
              <div className="text-center mt-4">
                {/* User Name */}
                <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                  Welcome, {user.name}!
                </h3>
                {/* User Email */}
                <div className="text-sm leading-normal mt-0 mb-4 text-blueGray-400 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  {user.email}
                </div>
              </div>
            </div>

            <div className="flex gap-10 mt-2">
              {/* Orders Navigation */}
              <div
                className={`relative flex w-1/2 items-center justify-center rounded-xl bg-gray-200 px-4 py-3 font-medium text-gray-700 ${
                  activeSection === "orders" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => setActiveSection("orders")}
              >
                <span className="pointer-events-none z-10">Orders</span>
                {activeSection === "orders" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>
                )}
              </div>
              {/* Favorites Navigation */}
              <div
                className={`relative flex w-1/2 items-center justify-center rounded-xl bg-gray-200 px-4 py-3 font-medium text-gray-700 ${
                  activeSection === "favorites" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => setActiveSection("favorites")}
              >
                <span className="pointer-events-none z-10">Favorites</span>
                {activeSection === "favorites" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>
                )}
              </div>
            </div>

            {/* Render content based on activeSection */}
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
  {isUpdateModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="my-4 max-w-screen-md border px-4  sm:py-4 md:mx-auto">
        <div className="flex flex-col border-b py-4  text-center">
         
            <p className="font-medium">Account Details</p>
            <p className="text-sm text-gray-600">Edit your account details</p>
         
       
        </div>
        {/* Add input fields for updating user details */}
        <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p className="shrink-0 w-32 font-medium">Name</p>
          <label
            htmlFor="name"
          >
              <input
              type="text" id="name"

              
          
          
     
         
            value={updateData.name}
            onChange={(e) =>
              setUpdateData({ ...updateData, name: e.target.value })
            }
          />
          </label>
      
        </div>
        <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p className="shrink-0 w-32 font-medium">Email</p>
          <input
          disabled
            type="email"
            id="email"
            value={updateData.email}
            onChange={(e) =>
              setUpdateData({ ...updateData, email: e.target.value })
            }
          />
        </div>
        {/* Profile Image */}
   <div className="flex h-56 w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 p-5 text-center">
  {updateData.newProfileImage || user.profileImage || updateData.deleteProfileImage ? (
    <div className="flex flex-col items-center">
      <div className="relative">
        {updateData.deleteProfileImage ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <p className="text-white text-sm">Deleted</p>
          </div>
        ) : (
          <img
            src={
              updateData.newProfileImage
                ? URL.createObjectURL(updateData.newProfileImage)
                : user.profileImage
            }
            alt="Profile"
            className="h-24 w-24 rounded-full"
          />
        )}
      </div>
      {!updateData.deleteProfileImage && (
        <div className="mt-2">
          <button
            className="text-sm text-blue-600 hover:underline focus:outline-none"
            onClick={handleDeleteImage}
          >
            Delete Image
          </button>
        </div>
      )}
      <div className="mt-2">
        <label
          htmlFor="newProfileImage"
          className="text-sm text-blue-600 hover:underline cursor-pointer"
        >
          {updateData.newProfileImage ? "Change Image" : "Add Image"}
        </label>
        <input
          type="file"
          id="newProfileImage"
          accept="image/*"
          onChange={handleFileChange}
          onClick={handleAddImage} // Handle add image click
    
          disabled={updateData.newProfileImage !== null}
          className="hidden"
        />
      </div>
    </div>
  ) : (
    <div className="text-center">
      <label
        htmlFor="newProfileImage"
        className="text-sm text-gray-600 hover:underline cursor-pointer"
      >
        Add Profile Image
      </label>
      <input
        type="file"
        id="newProfileImage"
        accept="image/*"
        onChange={handleFileChange}
        onClick={handleAddImage} // Handle add image click
        disabled={updateData.newProfileImage !== null}
        className="hidden"
      />
    </div>
  )}
</div>

      </div>
         <button
            onClick={() => setUpdateModalOpen(false)}
            className="mr-2 rounded-lg border-2 px-4 py-2 font-medium text-gray-500 sm:inline focus:outline-none focus:ring hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white sm:inline focus:outline-none focus:ring hover:bg-blue-700"
          >
            {
              loading ? 'Updating...'
               : 'Update'
            }
          </button>
    </div>
    
  </div>
)}

    </section>
  );
};

export default Profile;
