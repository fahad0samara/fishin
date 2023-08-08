// import {useState, useEffect} from "react";

// import {useDispatch, useSelector} from "react-redux";
// import {
//   fetchCategories,
//   createCategory,
//   deleteCategory,
// } from "./redux/category/categoryThunks";
// function CategoryList() {
//   const {category, loading, error} = useSelector(state => state.category);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   //delete
//   async function handleDelete(categoryId) {
//     try {
//       // Send a DELETE request and dispatch
//       // the returned category object
//       const deletedCategory = dispatch(deleteCategory(categoryId));
//       console.log(deletedCategory);
//       dispatch(fetchCategories());
//     } catch (error) {
//       console.error("Error deleting category:", error);
//     }
//   }

//   return (
//     <div>
//       <h1>Categories</h1>
//       <ul>
//         {category.map(category => (
//           <li key={category._id}>
//             {category.name} - {category.description}
//             <button onClick={() => handleDelete(category._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// function CategoryForm() {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const {category, loading, error} = useSelector(state => state.category);
//   const dispatch = useDispatch();

//   async function handleSubmit(event) {
//     event.preventDefault();

//     try {
//       // Send a POST request and dispatch
//       // the returned category object
//       const createdCategory = await dispatch(
//         createCategory({name, description})
//       );
//       console.log(createdCategory);

//       // Clear form fields
//       setName("");
//       setDescription("");
//     } catch (error) {
//       console.error("Error creating category:", error);
//     }
//   }

//   return (
//     <div>
//       <h2>Create Category</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Name:</label>
//           <input
//             type="text"
//             value={name}
//             onChange={e => setName(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Description:</label>
//           <textarea
//             value={description}
//             onChange={e => setDescription(e.target.value)}
//           />
//         </div>
//         <button type="submit">Create</button>
//       </form>

//       <CategoryList />
//     </div>
//   );
// }

// export default CategoryForm;

import {useState, useEffect} from "react";
import {FaEdit, FaTrashAlt} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  ErrorResponse,
} from "./redux/category/categoryThunks";
import {AnyAction, ThunkDispatch} from "@reduxjs/toolkit";
import {RootState} from "./redux/store";
import {toast} from "react-toastify";
function CategoryList() {
  const {category, loading, error} = useSelector(
    (state: RootState) => state.category
  );

  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [inputErrors, setInputErrors] = useState({
     name: "",
     description: "",
   });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCreateCategory = () => {
    try {
      if (validateInputs()) {
        dispatch(
          createCategory({name: categoryName, description: categoryDescription})
        );
        setCategoryName("");
        setCategoryDescription("");
        setIsCreateModalOpen(false);
        toast.success("Category created successfully!");
      }
    } catch (error) {
      toast.error((error as ErrorResponse).message);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      if (
        selectedCategoryId !== null &&
        categoryName.trim() !== "" &&
        categoryDescription.trim() !== ""
      ) {
        await dispatch(
          updateCategory({
            categoryId: selectedCategoryId,
            categoryData: {
              name: categoryName,
              description: categoryDescription,
            },
          })
        );
        setCategoryName("");
        setCategoryDescription("");
        setSelectedCategoryId(null);
        setIsEditModalOpen(false);

        dispatch(fetchCategories());
        toast.success("Category updated successfully!");
      }
    } catch (error) {
      toast.error((error as ErrorResponse).message);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      if (selectedCategoryId !== null) {
        await dispatch(deleteCategory(selectedCategoryId));
        setSelectedCategoryId(null);
        setIsDeleteModalOpen(false);

        dispatch(fetchCategories());
        toast.success("Category deleted successfully!");
      }
    } catch (error) {
      toast.error((error as ErrorResponse).message);
    }
  };


    const validateInputs = () => {
      let isValid = true;
      const errors = {
        name: "",
        description: "",
      };

      if (categoryName.trim() === "") {
        errors.name = "Category name is required";
        isValid = false;
      }

      if (categoryDescription.trim() === "") {
        errors.description = "Category description is required";
        isValid = false;
      }

      setInputErrors(errors);

      return isValid;
    };



  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4">
        Error: {(error as ErrorResponse).message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4">Categories</h1>
      <div className="mt-8">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Create New Category
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border p-3 text-left">Name</th>
            <th className="border p-3 text-left">Description</th>
            <th className="border p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {category.map(category => (
            <tr key={category._id} className="bg-white hover:bg-gray-100">
              <td className="border p-3 text-lg">{category.name}</td>
              <td className="border p-3 text-lg">{category.description}</td>
              <td className="border p-3 space-x-2">
                <button
                  onClick={() => {
                    setSelectedCategoryId(category._id as number | null);
                    setCategoryName(category.name);
                    setCategoryDescription(category.description);
                    setIsEditModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none transition-colors duration-300"
                >
                  <FaEdit className="inline-block mr-1 -mt-1" />
                  Edit
                </button>

                <button
                  onClick={() => {
                    setSelectedCategoryId(category._id as number | null);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-300"
                >
                  <FaTrashAlt className="inline-block mr-1 -mt-1" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Category Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Create New Category</h2>
            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={e => setCategoryName(e.target.value)}
              className="px-4 py-2 border rounded w-full mb-2"
            />
            {inputErrors.name && (
              <p className="text-red-500 text-sm">{inputErrors.name}</p>
            )}
            <input
              type="text"
              placeholder="Category Description"
              value={categoryDescription}
              onChange={e => setCategoryDescription(e.target.value)}
              className="px-4 py-2 border rounded w-full mb-2"
            />
            {inputErrors.description && (
              <p className="text-red-500 text-sm">{inputErrors.description}</p>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedCategoryId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Edit Category</h2>
            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={e => setCategoryName(e.target.value)}
              className="px-4 py-2 border rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="Category Description"
              value={categoryDescription}
              onChange={e => setCategoryDescription(e.target.value)}
              className="px-4 py-2 border rounded w-full mb-2"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  setIsEditModalOpen(false);
                  setCategoryName(""); // Reset the input fields
                  setCategoryDescription(""); // Reset the input fields
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {isDeleteModalOpen && selectedCategoryId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Delete Category</h2>
            <p>Are you sure you want to delete this category?</p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryList;
