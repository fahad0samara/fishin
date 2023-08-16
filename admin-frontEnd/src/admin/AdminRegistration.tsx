/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState } from "react";
import axios from "axios";

function AdminRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const handleInputChange = (event: { target: { name: string; value: any; files: any; }; }) => {
    const { name, value, files } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const { name, email, password, profileImage } = formData;

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    data.append("profileImage", profileImage);

    try {
      await axios.post("http://localhost:3000/auth/register-admin", data);
      alert("Admin registered successfully!");
    } catch (error) {
      console.error("Error registering admin:", error);
      alert("Error registering admin. Please check the console for details.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Admin Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            Name:
          </label>
          <input
            className="border border-gray-300 px-3 py-2 rounded-md w-full"
            type="text"
            name="name"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            className="border border-gray-300 px-3 py-2 rounded-md w-full"
            type="email"
            name="email"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
            Password:
          </label>
          <input
            className="border border-gray-300 px-3 py-2 rounded-md w-full"
            type="password"
            name="password"
            onChange={handleInputChange}
            required
          />
        </div>
    <div className="flex items-center mb-4">
  {formData.profileImage ? (
    <div className="flex items-center mr-4">
      <img
        className="w-16 h-16 object-cover rounded-full mr-2"
        src={URL.createObjectURL(formData.profileImage)}
        alt="Profile"
      />
      <button
        className="text-red-600 hover:text-red-800 focus:outline-none"
        onClick={() => setFormData({ ...formData, profileImage: null })}
      >
        Remove
      </button>
    </div>
  ) : null}
  <label className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer">
    Upload Image
    <input
      className="hidden"
      type="file"
      name="profileImage"
      onChange={handleInputChange}
      accept="image/*"
    />
  </label>
</div>

        <div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            type="submit"
          >
            Register Admin
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminRegistration;
