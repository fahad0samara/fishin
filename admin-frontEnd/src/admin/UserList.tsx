import  { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { BiLoaderCircle } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  wishlist: string[];
  orders: string[];
  role: string;
}

function UserList() {
    const user = useSelector((state: RootState) => state.auth.user);
  const [users, setUsers] = useState<User[]>([]);
  const[loading,setloading]=useState<boolean>(false)
   const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
     const [sortField, setSortField] = useState('name'); // Default sorting field
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order

  const fetchUsers = useCallback(async () => {
        setloading(true)
    try {
      const response = await axios.get<User[]>('http://localhost:3000/auth/all', {
        params: { page: currentPage, limit: usersPerPage, sortField, sortOrder },
      });
      setUsers(response.data);
        setloading(false)
    } catch (error) {
      console.error('Error fetching users:', error);
        toast.error('Error fetching users');
          setloading(false)
    }
    }, [currentPage, usersPerPage, sortField, sortOrder]);
    


  useEffect(() => {
    fetchUsers();
  }, [currentPage, usersPerPage, sortField, sortOrder, fetchUsers]);

 const currentUser = user;
   console.log("Logged-in user ID:", user?._id);
  console.log("Deleting user ID:",);
console.log(currentUser.role ,"AdminRegistration");
 async function handleDeleteUser(userId: string) {
    
    setloading(true);
    try {
        if (user?.id === userId) {
        toast.error("You cannot delete your own account.");
      } else {
        await axios.delete(`http://localhost:3000/auth/delete-user/${userId}`);
        // Refresh user list after deletion
        fetchUsers();
        toast.success('User deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    } finally {
      setloading(false);
    }
  }


  //loading
    if (loading) {
        return <div className="
        flex
        items-center
        justify-center
        h-screen
       
        
        ">
    
            <BiLoaderCircle
                className="animate-spin text-6xl text-blue-500"
            />
        </div>;
    }



  return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-semibold mb-4 ml-3">User List</h1>
         <div className="flex justify-end mb-4">
        <label className="mr-2">Users per Page:</label>
        <select
          className="border px-2 py-1 rounded"
          value={usersPerPage}
          onChange={(e) => setUsersPerPage(parseInt(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>

        </select>
      </div>
      <div className="mb-4 flex space-x-2">
        <label>Sort by:</label>
        <select
          className="border px-2 py-1 rounded"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="role">Role</option>

       
        </select>
        <select
          className="border px-2 py-1 rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
        <div className="overflow-x-auto">
         <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-200 text-left">Name</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Email</th>
              <th className="px-6 py-3 bg-gray-200 text-left hidden md:table-cell">Profile Image</th>
              <th className="px-6 py-3 bg-gray-200 text-left hidden lg:table-cell">Wishlist</th>
              <th className="px-6 py-3 bg-gray-200 text-left hidden lg:table-cell">Orders</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Role</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="odd:bg-gray-100">
                <td className="border px-6 py-3">{user.name}</td>
                <td className="border px-6 py-3">{user.email}</td>
                <td className="border px-6 py-3 hidden md:table-cell">
                  <img src={user.profileImage} alt={`${user.name}`} className="w-12 h-12 rounded-full" />
                </td>
                <td className="border px-6 py-3 hidden lg:table-cell">{user.wishlist.join(', ')}</td>
                <td className="border px-6 py-3 hidden lg:table-cell">{user.orders.join(', ')}</td>
                <td className="border px-6 py-3">{user.role}</td>
                <td className="border px-6 py-3">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className={`bg-red-500 hover:bg-red-700 text-white md:font-bold py-1 px-4 rounded-full mr-2 flex items-center
                      ${
                        user.role === 'admin' && user.id === currentUser._id && 'opacity-50 cursor-not-allowed'
                      }
                    `}
                    disabled={user.role === 'admin' && user._id === currentUser.id}
                  >
                    {user.role === 'admin' && user._id === currentUser.id ? 'Cannot Delete' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          
        </div>
         <div className="flex justify-center mt-12">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2 flex items-center'}
        >
          <AiOutlineArrowLeft className="mr-2" /> Previous
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center'}
        >
          Next <AiOutlineArrowRight className="ml-2" />
        </button>
      </div>
      </div>
  );
}

export default UserList;
