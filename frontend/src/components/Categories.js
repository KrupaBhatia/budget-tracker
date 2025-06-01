import React, { useState, useEffect } from 'react';
import API from '../services/api'; // Assuming you have API setup for making HTTP requests
import { Link } from 'react-router-dom'; // Import Link for navigation

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [type, setType] = useState('income'); // Default type is 'income'
  const [userId, setUserId] = useState(localStorage.getItem('userId') || ''); // Retrieve userId from localStorage
  const [editingCategory, setEditingCategory] = useState(null); // State to manage the category being edited
  const [updatedCategory, setUpdatedCategory] = useState(''); // State to store the updated category name

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories/'); // Fetch all categories
      setCategories(res.data); // Store categories in state
    } catch (err) {
      console.error(err); // Error handling
    }
  };

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    try {
      await API.post('/categories/', { 
        name: newCategory, 
        type: type, 
        user: userId // Send userId along with name and type
      });
      setNewCategory(''); // Clear input after adding
      setType('income'); // Reset type to income
      fetchCategories(); // Refresh categories list
    } catch (err) {
      console.error(err); // Error handling
    }
  };

  // Edit category
  const handleEditCategory = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    try {
      await API.patch(`/categories/${editingCategory.id}/`, { name: updatedCategory }); // PATCH request to update category
      setEditingCategory(null); // Reset editing category
      setUpdatedCategory(''); // Clear input
      fetchCategories(); // Refresh categories list
    } catch (err) {
      console.error(err); // Error handling
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    try {
      await API.delete(`/categories/${id}/`); // DELETE request to remove category
      fetchCategories(); // Refresh categories list
    } catch (err) {
      console.error(err); // Error handling
    }
  };

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
        Manage Categories
      </h1>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="space-y-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category"
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          Add Category
        </button>
      </form>

      {/* Categories List */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categories</h2>
        <ul className="space-y-4">
          {categories.map((category) => (
            <li key={category.id} className="border border-gray-300 p-4 rounded-lg flex justify-between items-center hover:bg-gray-100 transition">
              <div>
                <strong>{category.name}</strong> ({category.type})
              </div>

              <div className="space-x-3">
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setUpdatedCategory(category.name); // Set the current category name to the edit input
                  }}
                  className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Category Form */}
      {editingCategory && (
        <form onSubmit={handleEditCategory} className="space-y-4">
          <input
            type="text"
            value={updatedCategory}
            onChange={(e) => setUpdatedCategory(e.target.value)}
            placeholder="Updated Category"
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button type="submit" className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
            Update Category
          </button>
          <button
            onClick={() => setEditingCategory(null)}
            type="button"
            className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between space-x-4">
        <Link to="/transactions" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          Go to Transactions
        </Link>
        <Link to="/budget" className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
          Go to Budget
        </Link>
        <Link to="/" className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-700 transition">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default CategoryPage;
