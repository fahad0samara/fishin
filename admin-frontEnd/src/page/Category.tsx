import {useState, useEffect} from "react";
import {FaEdit, FaTrashAlt} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  ErrorResponse,
} from "../redux/category/categoryThunks";
import {AnyAction, ThunkDispatch} from "@reduxjs/toolkit";
import {RootState} from "../redux/store";
import {toast} from "react-toastify";
import {validateInputs} from "../error/Valid";
function Category() {
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
      const {isValid, errors} = validateInputs(
        categoryName,
        categoryDescription
      );

      if (isValid) {
        dispatch(
          createCategory({name: categoryName, description: categoryDescription})
        );
        setCategoryName("");
        setCategoryDescription("");
        setIsCreateModalOpen(false);
        toast.success("Category created successfully!");
        setInputErrors({name: "", description: ""});
      } else {
        setInputErrors(errors);
      }
    } catch (error) {
      toast.error((error as ErrorResponse).message);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      const {isValid, errors} = validateInputs(
        categoryName,
        categoryDescription
      );

      if (isValid) {
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
          setInputErrors({name: "", description: ""});
        }
      } else {
        setInputErrors(errors);
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
            onClick={() => {
              setIsCreateModalOpen(true);
              setCategoryName("");
              setCategoryDescription("");
              setInputErrors({name: "", description: ""});
            }}
            className={
              "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            }
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
            <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-semibold mb-2">Create New Category</h2>
              <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={e => {
                  setCategoryName(e.target.value);
                  setInputErrors(prevState => ({...prevState, name: ""}));
                }}
                className="px-4 py-2 border rounded w-full mb-2"
              />
              {inputErrors.name && (
                <p className="text-red-500 text-sm">{inputErrors.name}</p>
              )}
              <input
                type="text"
                placeholder="Category Description"
                value={categoryDescription}
                onChange={e => {
                  setCategoryDescription(e.target.value);
                  setInputErrors(prevState => ({...prevState, description: ""}));
                }}
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
                  className={'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700'}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {isEditModalOpen && selectedCategoryId !== null && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-2">Edit Category</h2>
              <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={e => {
                  setCategoryName(e.target.value);
                  setInputErrors(prevState => ({...prevState, name: ""}));
                }}
                className="px-4 py-2 border rounded w-full mb-2"
              />
              {inputErrors.name && (
                <p className="text-red-500 text-sm">{inputErrors.name}</p>
              )}
              <input
                type="text"
                placeholder="Category Description"
                value={categoryDescription}
                onChange={e => {
                  setCategoryDescription(e.target.value);
                  setInputErrors(prevState => ({...prevState, description: ""}));
                }}
                className="px-4 py-2 border rounded w-full mb-2"
              />
              {inputErrors.description && (
                <p className="text-red-500 text-sm">{inputErrors.description}</p>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setIsEditModalOpen(false);
                    setCategoryName(""); // Reset the input fields
                    setCategoryDescription(""); // Reset the input fields
                    setInputErrors({name: "", description: ""}); // Clear errors
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

export default Category;
