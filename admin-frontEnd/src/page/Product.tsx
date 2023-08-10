/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState, useEffect, ChangeEvent, FormEvent} from "react";
import axios from "axios";
import {fetchCategories} from "../redux/category/categoryThunks";
import {AnyAction, ThunkDispatch} from "@reduxjs/toolkit";
import {RootState} from "../redux/store";
import {useDispatch, useSelector} from "react-redux";
import Select, { MultiValue} from "react-select";
import {
  createProduct,
  deleteProduct,
  fetchProduct,
  updateProduct,
  ErrorResponse,
} from "../redux/Product/productThunks";
import {toast} from "react-toastify";

import {Color, Product, Size, formData} from "../type";
import { FaExpeditedssl, FaTrashRestoreAlt} from "react-icons/fa";

const Product: React.FC = () => {
  const {product, loading, error, totalPages, currentPage} = useSelector(
    (state: RootState) => state.product
  );

  const {category} = useSelector((state: RootState) => state.category);

  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProduct({page: currentPage, limit: 10}));
  }, [dispatch, currentPage]);
  const handlePageChange = (newPage: number) => {
    dispatch(fetchProduct({page: newPage, limit: 10}));
  };

  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [formData, setFormData] = useState<formData>({
    name: "",
    category: "",
   

    price: 0,
   
    description: "",
    images: [],
    brand: "",
    selectedColors: [],
    selectedSizes: [],
  });

  useEffect(() => {
    // Fetch categories, colors, and sizes from dynamic data source
    const fetchDynamicData = async () => {
      try {
        const colorsResponse = await axios.get<Color[]>(
          "http://localhost:3000/colorsSizes/colors"
        );
        const sizesResponse = await axios.get<Size[]>(
          "http://localhost:3000/colorsSizes/sizes"
        );

        setColors(colorsResponse.data);
        setSizes(sizesResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDynamicData();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    setUpdatedProductData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateImageChange0 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUpdatedProductData(prevData => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
  

 };





  const handleUpdateRemoveImage = (indexToRemove: React.Key | null | undefined) => {
    setUpdatedProductData(prevData => ({
      ...prevData,
      images: prevData.images.filter((_: any, index: number) => index !== indexToRemove),
    }));
  };

  const handleUpdateRemoveAllImages = () => {
    setUpdatedProductData(prevData => ({
      ...prevData,
      images: [],
    }));
  };

  const handleupdateColorChange = (selectedOptions: MultiValue<any>) => {
    const selectedColors = selectedOptions.map(option => option.value);
    setUpdatedProductData(prevData => ({
      ...prevData,
      selectedColors,
    }));
  };

  const handleUpdateCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    setUpdatedProductData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateSizeChange = (selectedOptions: MultiValue<any>) => {
    const selectedSizes = selectedOptions.map(option => option.value);
    setUpdatedProductData(prevData => ({
      ...prevData,
      selectedSizes,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prevData => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prevData => ({
      ...prevData,
      images: prevData.images.filter((_: any, index: number) => index !== indexToRemove),
    }));
  };

  const handleRemoveAllImages = () => {
    setFormData(prevData => ({
      ...prevData,
      images: [],
    }));
  };

  const handleColorChange = (selectedOptions: any[]) => {
    const selectedColors = selectedOptions.map(option => option.value);
    setFormData(prevData => ({
      ...prevData,
      selectedColors,
    }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSizeChange = (selectedOptions: any[]) => {
    const selectedSizes = selectedOptions.map(option => option.value);
    setFormData(prevData => ({
      ...prevData,
      selectedSizes,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  

    const formDataWithImages = new FormData();
    formDataWithImages.append("name", formData.name);
    formDataWithImages.append("price", formData.price.toString());
    formDataWithImages.append("category", formData.category);
    formDataWithImages.append("description", formData.description);

    formData.images.forEach((image: string | Blob) => {
      formDataWithImages.append("images", image);
    });

    formDataWithImages.append("brand", formData.brand);

    formData.selectedColors.forEach((colorId: string | Blob) => {
      formDataWithImages.append("colors", colorId);
    });

    formData.selectedSizes.forEach((sizeId: string | Blob) => {
      formDataWithImages.append("sizes", sizeId);
    });

  



    try {
      await dispatch(createProduct(formDataWithImages));
      toast.success("Product created successfully");

      // Clear the form after successful submission
      setFormData({
        name: "",
        price: 0,
        category: "",
      
     
        description: "",
        images: [],
        brand: "",
        selectedColors: [],
        selectedSizes: [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleRemoveProduct = async () => {
    try {
      if (selectedProductId !== null) {
        await dispatch(deleteProduct(selectedProductId));
        setIsDeleteModalOpen(false);
        dispatch(fetchProduct({page: currentPage, limit: 10}));
        toast.success("Category deleted successfully!");
      }
    } catch (error) {
      toast.error((error as ErrorResponse).message);
    }
  };

  const [updatedProductData, setUpdatedProductData] = useState({})

  const handleEditClick = (product: Product) => {
  //@ts-ignore
  setSelectedProductId(product._id);
  setUpdatedProductData({
    name: product.name,
    price: product.price,
    category: product.category._id,
    description: product.description,
    images: product.images,
    brand: product.brand,
    selectedColors: product.colors.map((color: Color) => color._id),
    selectedSizes: product.sizes.map((size: Size) => size._id),
  });
  setIsEditModalOpen(true);
};

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (updatedProductData.images.length === 0) {
      // Display an error message or handle validation here
      console.log("No images selected");
      return;
    }
    const formDataWithImages = new FormData();
    formDataWithImages.append("name", updatedProductData.name);
    formDataWithImages.append("price", updatedProductData.price.toString());
    formDataWithImages.append("category", updatedProductData.category);
    formDataWithImages.append("description", updatedProductData.description);
    formDataWithImages.append("brand", updatedProductData.brand);

    updatedProductData.images.forEach((image: string | Blob, index: number) => {
      if (typeof image === "string") {
        formDataWithImages.append(`images[${index}]`, image); // For existing images
      } else {
        formDataWithImages.append("images", image); // For new images
      }
    });

    updatedProductData.selectedColors.forEach((colorId: string) => {
      formDataWithImages.append("colors", colorId);
    });

    updatedProductData.selectedSizes.forEach((sizeId: string) => {
      formDataWithImages.append("sizes", sizeId);
    });

    try {
      await dispatch(
        updateProduct({
          productId: selectedProductId, // Use selectedProductId here
          formDataWithImages,
        })
      );

      setIsEditModalOpen(false);
      dispatch(fetchProduct({page: currentPage, limit: 10}));

      toast.success("Product updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };


  //loading
  if (loading) {
    return <h1>Loading...</h1>;
  }
  //error
  if (error) {
    return <h1> Error: {(error as ErrorResponse).message}</h1>;
  }

  return (
    <div className="p-4 ">
      <h2 className="text-xl font-semibold mb-4">Add Product</h2>
      <form
        className="flex flex-col space-y-4 max-w-2xl mx-auto  w-full"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label className="block mb-2">
          Name:
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </label>
        <label className="block mb-2">
          Price:
          <input
            className="border rounded w-full py-2 px-3"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
        </label>
        <label className="block mb-2">
          Category:
          <select
            className="border rounded w-full py-2 px-3"
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
          >
            <option value="">Select a category</option>
            {category.map(category => (
              <option key={category._id} value={category._id?.toString()}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block mb-2">
          Description:
          <textarea
            className="border rounded w-full py-2 px-3"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </label>
        <label className="block mb-2">
          Brand:
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
          />
        </label>
        <>
          <span className="text-lg font-semibold">Images:</span>
          <div className="border rounded p-3 mt-2">
            <div className="grid grid-cols-3 gap-4 bg">
              {formData.images.map((image: Blob | MediaSource, index: React.Key | null | undefined) => (
                <div
                  onClick={e => e.stopPropagation()}
                  key={index}
                  className="relative group"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Image ${index + 1}`}
                    className="w-full h-24 object-cover rounded border border-gray-200 shadow-md transition-transform transform group-hover:scale-110"
                  />
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-opacity opacity-0 group-hover:opacity-100"
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a8 8 0 100 16 8 8 0 000-16zm.293 9.293a1 1 0 011.414 0L13 12.586l2.293-2.293a1 1 0 111.414 1.414L14.414 14l2.293 2.293a1 1 0 01-1.414 1.414L13 15.414l-2.293 2.293a1 1 0 01-1.414-1.414L11.586 14 9.293 11.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {formData.images.length > 0 && (
              <div className="mt-4 flex justify-center">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
                  type="button"
                  onClick={handleRemoveAllImages}
                >
                  Remove All Images
                </button>
              </div>
            )}
            <div className="mt-4 flex ">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full mt-4"
                type="button"
                onClick={e => {
                  e.preventDefault();
                  //dontloadthe user clike the input
                  e.stopPropagation();
                  //dontloadthe user clike the input
                  document.getElementsByName("images")[0].click();
                }}
              >
                Add More Images
              </button>
            </div>
          </div>
          <input
            className="hidden"
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Colors:</label>
          <Select
            isMulti
            name="colors"
            value={formData.selectedColors
              .filter((colorId: string) => colors.some(color => color._id === colorId))
              .map((colorId: string) => ({
                value: colorId,
                label: colors.find(color => color._id === colorId)?.name,
              }))}
            options={colors.map(color => ({
              value: color._id,
              label: (
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{backgroundColor: color.code}}
                  ></div>
                  {color.name}
                </div>
              ),
            }))}
            onChange={handleColorChange}
            className="basic-multi-select"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Sizes:</label>
          <Select
            isMulti
            name="sizes"
            value={formData.selectedSizes.map((sizeId: string) => ({
              value: sizeId,
              label: sizes.find(size => size._id === sizeId)?.name,
            }))}
            options={sizes.map(size => ({
              value: size._id,
              label: size.name,
            }))}
            onChange={handleSizeChange}
            className="basic-multi-select"
          />
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Add Product
        </button>
      </form>
      <div className="container mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border">
            <thead>
              <tr>
                <th className="border p-2">Images</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">category</th>
                <th className="border p-2">Brand</th>
                <th className="border p-2">Colors</th>
                <th className="border p-2">Sizes</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {product.map(product => (
                <tr key={product._id}>
                  <td className="border p-2">
                    <div className="flex">
                      {product.images.slice(0, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${product.name} Image ${index + 1}`}
                          className="h-20 w-20 object-contain m-1"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">${product.price}</td>
                  <td className="border p-2">{product.description}</td>
                  <td className="border p-2">{product.category.name}</td>
                  <td className="border p-2">{product.brand}</td>
                  <td className="border p-2">
                    {product.colors.map(color => color.name).join(", ")}
                  </td>
                  <td className="border p-2">
                    {product.sizes.map(size => size.name).join(", ")}
                  </td>
                  <td className="border p-3 space-x-2">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none transition-colors duration-300"
                    >
                      <FaExpeditedssl className="inline-block mr-1 -mt-1" />
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setSelectedProductId(product._id as any);
                      }}
                      className="text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-300"
                    >
                      <FaTrashRestoreAlt className="inline-block mr-1 -mt-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-l"
          >
            Previous
          </button>
          {totalPages > 0 && (
            <span className="bg-gray-300 py-2 px-4">
              Page {currentPage} of {totalPages}
            </span>
          )}
          {currentPage < totalPages && totalPages > 0 && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-r"
            >
              Next
            </button>
          )}
        </div>
      </div>
      {isEditModalOpen && selectedProductId !== null && (
        <div className="fixed bg-slate-400 inset-0 flex items-center justify-center z-50 bg-opacity-50">
          <div
            className="
            bg-white
            rounded-lg
            overflow-hidden
            max-w-5xl
            mx-auto
            p-4
          max-h-[700px]
          overflow-y-auto 
           

          "
          >
            <div className="max-h-screen p-8">
              <form
                className="flex flex-col space-y-4 max-w-xl mx-auto w-full"
                onSubmit={handleUpdate}
                encType="multipart/form-data"
              >
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block mb-2">Name:</label>
                    <input
                      className="border rounded w-full py-2 px-3"
                      type="text"
                      name="name"
                      value={updatedProductData.name}
                      onChange={handleUpdateInputChange}
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block mb-2">Price:</label>
                    <input
                      className="border rounded w-full py-2 px-3"
                      type="number"
                      name="price"
                      value={updatedProductData.price}
                      onChange={handleUpdateInputChange}
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block mb-2">Category:</label>
                    <select
                      className="border rounded w-full py-2 px-3"
                      name="category"
                      value={updatedProductData.category}
                      onChange={handleUpdateCategoryChange}
                    >
                      <option value="">Select a category</option>
                      {category.map(category => (
                        <option
                          key={category._id}
                          value={category._id?.toString()}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/2 mt-1">
                    <label className="block ">
                      Brand:
                      <input
                        className="border rounded w-full py-2 px-3"
                        type="text"
                        name="brand"
                        value={updatedProductData.brand}
                        onChange={handleUpdateInputChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="">
                  <label className="block mb-2">Description:</label>
                  <textarea
                    className="border rounded w-full py-2 px-3"
                    name="description"
                    value={updatedProductData.description}
                    onChange={handleUpdateInputChange}
                  />
                </div>
                {/* Add image handling */}
                <>
                  <span className="text-lg font-semibold">Images:</span>
                  <div className="border rounded p-3 mt-2">
                    <div className="grid grid-cols-3 gap-4 bg">
                      {updatedProductData.images.map((image: string | Blob | MediaSource | undefined, index: React.Key | null | undefined) => (
                        <div
                          onClick={e => e.stopPropagation()}
                          key={index}
                          className="relative group"
                        >
                          <img
                            src={
                              typeof image === "string"
                                ? image
                                : URL.createObjectURL(image)
                            }
                            alt={`Image ${index + 1}`}
                            alt="product"
                            className="w-full h-14  object-cover rounded border border-gray-200 shadow-md transition-transform transform group-hover:scale-110"
                          />
                          <button
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-opacity opacity-0 group-hover:opacity-100"
                            type="button"
                            onClick={() => handleUpdateRemoveImage(index)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 2a8 8 0 100 16 8 8 0 000-16zm.293 9.293a1 1 0 011.414 0L13 12.586l2.293-2.293a1 1 0 111.414 1.414L14.414 14l2.293 2.293a1 1 0 01-1.414 1.414L13 15.414l-2.293 2.293a1 1 0 01-1.414-1.414L11.586 14 9.293 11.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex space-x-4">
                      {updatedProductData?.images?.length > 0 && (
                        <div className="mt-1 flex justify-center">
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-full"
                            type="button"
                            onClick={handleUpdateRemoveAllImages}
                          >
                            Remove All Images
                          </button>
                        </div>
                      )}
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full mt-1"
                        type="button"
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          const input = document.querySelector(
                            'input[name="imagess"]'
                          ) as HTMLInputElement;
                          input.click();
                        }}
                      >
                        Add More Images
                      </button>
                    </div>
                  </div>
                  <input
                    className="hidden"
                    type="file"
                    name="imagess"
                    multiple
                    accept="image/*"
                    onChange={handleUpdateImageChange0}
                  />
                </>

                <div className="grid grid-cols-2 gap-5">
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Colors:</label>
                    <Select
                      isMulti
                      name="colors"
                      value={updatedProductData.selectedColors
                        .filter((colorId: string) =>
                          colors.some(color => color._id === colorId)
                        )
                        .map((colorId: string) => ({
                          value: colorId,
                          label: colors.find(color => color._id === colorId)
                            ?.name,
                        }))}
                      options={colors.map(color => ({
                        value: color._id,
                        label: color.name,
                      }))}
                      onChange={handleupdateColorChange}
                      className="basic-multi-select"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Sizes:</label>
                    <Select
                      isMulti
                      name="sizes"
                      value={updatedProductData.selectedSizes.map(
                        (sizeId: string) => ({
                          value: sizeId,
                          label: sizes.find(size => size._id === sizeId)?.name,
                        })
                      )}
                      options={sizes.map(size => ({
                        value: size._id,
                        label: size.name,
                      }))}
                      onChange={handleUpdateSizeChange}
                      className="basic-multi-select"
                    />
                  </div>
                </div>

                <div className="flex justify-end ">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                  >
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Product Modal */}
      {isDeleteModalOpen && selectedProductId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Delete Product</h2>
            <p>Are you sure you want to delete this Product?</p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedProductId(null);
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveProduct}
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
};

export default Product;
