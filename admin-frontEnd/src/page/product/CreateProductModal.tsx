/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {useState, useEffect, ChangeEvent, FormEvent} from "react";
import axios from "axios";

import {AnyAction, ThunkDispatch} from "@reduxjs/toolkit";

import {useDispatch, useSelector} from "react-redux";
import Select, {MultiValue} from "react-select";

import {toast} from "react-toastify";
import {Color, Size, formData} from "../../type";
import {validateInputsProduct} from "../../error/Valid";
import {createProduct, fetchProduct} from "../../redux/Product/productThunks";
import {fetchCategories} from "../../redux/category/categoryThunks";
import {RootState} from "../../redux/store";
interface CreateCategoryModalProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const CreateProductModal = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
}: CreateCategoryModalProps) => {
  const {currentPage} = useSelector((state: RootState) => state.product);

  const {category} = useSelector((state: RootState) => state.category);

  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
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

  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [inputErrors, setInputErrors] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    images: "",
    brand: "",
    selectedColors: "",
    selectedSizes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [colorsResponse, sizesResponse] = await Promise.all([
          axios.get<Color[]>("http://localhost:3000/colorsSizes/colors"),
          axios.get<Size[]>("http://localhost:3000/colorsSizes/sizes"),
        ]);

        setColors(colorsResponse.data);
        setSizes(sizesResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    dispatch(fetchCategories());

    fetchData();
  }, [dispatch, currentPage]);
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    setInputErrors(prevErrors => ({
      ...prevErrors,
      [name]: "", // Clear the error message for this input
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prevData => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));

    setInputErrors(prevErrors => ({
      ...prevErrors,
      images: "", // Clear the error message for images
    }));
  };

  const handleRemoveImage = (indexToRemove: number): void => {
    setFormData(prevData => ({
      ...prevData,
      images: prevData.images.filter(
        (_: unknown, index: number) => index !== indexToRemove
      ),
    }));
  };

  const handleRemoveAllImages = () => {
    setFormData(prevData => ({
      ...prevData,
      images: [],
    }));
  };

  const handleColorChange = (selectedOptions: MultiValue<unknown>) => {
    //@ts-ignore
    const selectedColors = selectedOptions.map(option => option.value);
    setFormData(prevData => ({
      ...prevData,
      selectedColors,
    }));
    setInputErrors(prevErrors => ({
      ...prevErrors,
      selectedColors: "", // Clear the error message for selectedColors
    }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    setInputErrors(prevErrors => ({
      ...prevErrors,
      category: "", // Clear the error message for category
    }));
  };

  const handleSizeChange = (selectedOptions: MultiValue<unknown>) => {
    //@ts-ignore
    const selectedSizes = selectedOptions.map(option => option.value);
    setFormData(prevData => ({
      ...prevData,
      selectedSizes,
    }));
    setInputErrors(prevErrors => ({
      ...prevErrors,
      selectedSizes: "", // Clear the error message for selectedSizes
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const {isValid, errors} = validateInputsProduct(
      formData.name,
      formData.category,
      formData.price.toString(),
      formData.description,
      formData.images.map(file => file.name), // Convert File objects to their names (or URLs)
      formData.brand,
      formData.selectedColors,
      formData.selectedSizes
    );

    if (!isValid) {
      setInputErrors(errors);
      return;
    }

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
      setInputErrors({
        name: "",
        price: "",
        category: "",
        description: "",
        images: "",
        brand: "",
        selectedColors: "",
        selectedSizes: "",
      });

      await dispatch(fetchProduct({page: currentPage, limit: 10}));
      toast.success("Product created successfully");
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <div
      className={`
                ${isCreateModalOpen ? "fixed" : "hidden"}
                fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75
          `}
    >
      <div
        className="    max-h-[700px]
          overflow-y-auto "
      >
        <div className="lg:m-10">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="relative border border-gray-100 space-y-3 max-w-screen-xl mx-auto rounded-md bg-white p-6 shadow-xl lg:p-10"
          >
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className=""> Name Product</label>
                <input
                  name="name"
                  type="text"
                  placeholder="ex."
                  className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {inputErrors.name && (
                  <p className="text-red-500 text-sm">{inputErrors.name}</p>
                )}
              </div>
              <div>
                <label className="">price Product </label>
                <input
                  name="price"
                  type="number"
                  placeholder="ex.4.6"
                  className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                {inputErrors.price && (
                  <p className="text-red-500 text-sm">{inputErrors.price}</p>
                )}
              </div>

              <div>
                <label className="">Brand Product</label>
                <input
                  type="text"
                  placeholder="ex."
                  className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
                {inputErrors.brand && (
                  <p className="text-red-500 text-sm">{inputErrors.brand}</p>
                )}
              </div>
            </div>
            <label className="block mb-2">
              Description:
              <textarea
                className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
              {inputErrors.description && (
                <p className="text-red-500 text-sm">
                  {inputErrors.description}
                </p>
              )}
            </label>

            <div>
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
                {inputErrors.category && (
                  <p className="text-red-500 text-sm">{inputErrors.category}</p>
                )}
              </label>
            </div>
            <label className="block font-semibold mb-1">Colors:</label>
            <Select
              isMulti
              name="colors"
              value={formData.selectedColors
                .filter((colorId: string) =>
                  colors.some(color => color._id === colorId)
                )
                .map((colorId: string) => ({
                  value: colorId,
                  label: colors.find(color => color._id === colorId)?.name,
                }))}
              //@ts-ignore
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
            {inputErrors.selectedColors && (
              <p className="text-red-500 text-sm">
                {inputErrors.selectedColors}
              </p>
            )}
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
              {inputErrors.selectedSizes && (
                <p className="text-red-500 text-sm">
                  {inputErrors.selectedSizes}
                </p>
              )}
            </div>

            <>
              <span className="text-lg font-semibold">Images:</span>
              {formData.images.length > 0 && (
                <div className="border rounded p-2 mt-2 ">
                  <div className="grid grid-cols-3 gap-4 ">
                    {formData.images.map(
                      (
                        image: Blob | MediaSource,
                        index: React.Key | null | undefined
                      ) => (
                        <div
                          onClick={e => e.stopPropagation()}
                          key={index}
                          className="relative group"
                        >
                          <img
                            src={URL.createObjectURL(image)}
                            alt="product"
                            className="w-full h-16 object-cover rounded border border-gray-200 shadow-md transition-transform transform group-hover:scale-110"
                          />
                          <button
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-opacity opacity-0 group-hover:opacity-100"
                            type="button"
                            onClick={() =>
                              handleRemoveImage(
                                //@ts-ignore

                                index
                              )
                            }
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
                      )
                    )}
                  </div>
                </div>
              )}
              <div className="mt-4 flex space-x-8">
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
                  {
                    //if there is no image show upload image
                    formData.images.length === 0
                      ? "Upload Images"
                      : "Add More Images"
                  }
                </button>
              </div>
              <input
                className="hidden"
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              {inputErrors.images && (
                <p className="text-red-500 text-sm">{inputErrors.images}</p>
              )}
            </>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  //reset the form

                  //remove the erorr
                  setInputErrors({
                    name: "",
                    price: "",
                    category: "",
                    description: "",
                    images: "",
                    brand: "",
                    selectedColors: "",
                    selectedSizes: "",
                  });
                }}
                type="button"
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={
                  "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                }
              >
                Create

              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
