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

