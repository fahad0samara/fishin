// inputValidation.js for handleDeleteCategory and handleDeleteCategory
export const validateInputs = (name: string, description: string) => {
  let isValid = true;
  const errors = {
    name: "",
    description: "",
  };

  if (name.trim() === "") {
    errors.name = "Category name is required";
    isValid = false;
  } else if (name.length < 3) {
    errors.name = "Category name must be at least 3 characters long";
    isValid = false;
  }

  if (description.trim() === "") {
    errors.description = "Category description is required";
    isValid = false;
  } else if (description.length > 100) {
    errors.description = "Category description must be 100 characters or less";
    isValid = false;
  }

  return {isValid, errors};
};

export const validateInputsProduct = (
  name: string,
  category: string,
  price: string,
  description: string,
  images: string[],
  brand: string,
  selectedColors: string[],
  selectedSizes: string[]
) => {
  let isValid = true;
  const errors = {
    name: "",
    category: "",
    price: "",
    description: "",
    images: "",
    brand: "",
    selectedColors: "",
    selectedSizes: "",
  };

  if (name.trim() === "") {
    errors.name = "Product name is required";
    isValid = false;
  } else if (name.length < 3) {
    errors.name = "Product name must be at least 3 characters long";
    isValid = false;
  }

  if (category === "") {
    errors.category = "Please select a category";
    isValid = false;
  }

  if (price.trim() === "") {
    errors.price = "Price is required";
    isValid = false;
  } else if (isNaN(Number(price))) {
    errors.price = "Price must be a number";
    isValid = false;
  }

  if (images.length === 0 || images[0] === "") {
    errors.images = "Please upload at least one image";
    isValid = false;
  }

  if (description.trim() === "") {
    errors.description = "Description is required";
    isValid = false;
  }

  if (brand.trim() === "") {
    errors.brand = "Brand name is required";
    isValid = false;
  }

  if (selectedColors.length === 0) {
    errors.selectedColors = "Please select at least one color";
    isValid = false;
  }

  if (selectedSizes.length === 0) {
    errors.selectedSizes = "Please select at least one size";
    isValid = false;
  }

  return {isValid, errors};
};

