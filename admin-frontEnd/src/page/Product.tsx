import React, {useState, useEffect, ChangeEvent, FormEvent} from "react";
import axios from "axios";
import {fetchCategories} from "../redux/category/categoryThunks";
import {AnyAction, ThunkDispatch} from "@reduxjs/toolkit";
import {RootState} from "../redux/store";
import {useDispatch, useSelector} from "react-redux";
import Select from "react-select";
import {
  createProduct,
  deleteProduct,
  fetchProduct,
  updateProduct,
  ErrorResponse,
} from "../redux/Product/productThunks";
interface Color {
  _id: string;
  name: string;
  code: string;
}

interface Size {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

interface FormData {
  name: string;
  price: number;
  category: string;
  description: string;
  images: File[];
  brand: string;
  selectedColors: string[];
  selectedSizes: string[];
}

const Product: React.FC = () => {
     const {product, loading, error} = useSelector(
       (state: RootState) => state.category
     );

    
  const {category} = useSelector((state: RootState) => state.category);

const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: 0,
    category: "",
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
      images: prevData.images.filter((_, index) => index !== indexToRemove),
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

        formData.images.forEach(image => {
        formDataWithImages.append("images", image);
        });

        formDataWithImages.append("brand", formData.brand);

        formData.selectedColors.forEach(colorId => {
        formDataWithImages.append("colors", colorId);
        });

        formData.selectedSizes.forEach(sizeId => {
        formDataWithImages.append("sizes", sizeId);
        });
      

        try {
    
                // dispatch createProduct
                dispatch(createProduct(formDataWithImages)),
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  };
            


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
        } catch (error:any) {
        console.error("Error adding product:", error.response);
        }
    };

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
        <>
          <span className="text-lg font-semibold">Images:</span>
          <div className="border rounded p-3 mt-2">
            <div className="grid grid-cols-3 gap-4 bg">
              {formData.images.map((image, index) => (
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
                  const input = document.querySelector('input[type="file"]');
                  input.click();
                  console.log(input);
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
        <div className="mb-4">
          <label className="block font-semibold mb-1">Colors:</label>
          <Select
            isMulti
            name="colors"
            value={formData.selectedColors
              .filter(colorId => colors.some(color => color._id === colorId))
              .map(colorId => ({
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
            value={formData.selectedSizes.map(sizeId => ({
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
    </div>
  );
};

export default Product;
