import {useState, useEffect} from "react";
import axios from "axios";
function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          "http://localhost:3000/categories/get"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, [categories]);

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.map(category => (
          <li key={category._id}>
            {category.name} - {category.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
function CategoryForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/categories/add",
        {
          name,
          description,
        }
      );

      console.log("Category created:", response.data);

      // Clear form fields
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  }

  return (
    <div>
      <h2>Create Category</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>

      <CategoryList />
    </div>
  );
}

export default CategoryForm;








