import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ date: '', amount: '' });
  const [editingBudget, setEditingBudget] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  // Fetch all budgets
  const fetchBudgets = async () => {
    try {
      const res = await API.get('/budgets/');
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // Add new budget
  const handleAddBudget = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Check if a budget for the same month already exists
    const existingBudget = budgets.find(budget => budget.month === newBudget.date);

    if (existingBudget) {
      setErrorMsg('A budget for this month already exists.');
      return;
    }

    try {
      await API.post('/budgets/', {
        month: newBudget.date,
        amount: newBudget.amount,
        user: userId,
      });
      setNewBudget({ date: '', amount: '' });
      fetchBudgets();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const detail = err.response.data.detail || JSON.stringify(err.response.data);
        setErrorMsg(detail);
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    }
  };

  // Edit budget
  const handleEditBudget = async (budgetId) => {
    try {
      const res = await API.get(`/budgets/${budgetId}/`);
      setEditingBudget(res.data);
      setErrorMsg('');
    } catch (err) {
      console.error(err);
    }
  };

  // Update budget
  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/budgets/${editingBudget.id}/`, {
        month: editingBudget.month,
        amount: editingBudget.amount,
        user: userId,
      });
      setEditingBudget(null);
      fetchBudgets();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update budget.');
    }
  };

  // Delete budget
  const handleDeleteBudget = async () => {
    try {
      await API.delete(`/budgets/${budgetToDelete.id}/`);
      fetchBudgets();
      setShowConfirmDelete(false);
      setBudgetToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Budget Management</h2>

      {/* Add New Budget Form */}
      <form onSubmit={handleAddBudget} className="space-y-6 mb-8">
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {errorMsg}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            value={newBudget.date}
            onChange={(e) => setNewBudget({ ...newBudget, date: e.target.value })}
            className="block border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={newBudget.amount}
            onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
            className="block border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          Add Budget
        </button>
      </form>

      {/* Budget List */}
      <div>
        {budgets.map((budget) => (
          <div key={budget.id} className="border border-gray-300 p-4 mb-4 rounded-lg hover:bg-gray-50 transition">
            <h3 className="text-xl font-semibold">Date: {budget.month}</h3>
            <p className="text-lg">Amount: ₹ {budget.amount}</p>
            <div className="mt-4 flex justify-between space-x-4">
              <button
                onClick={() => handleEditBudget(budget.id)}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setShowConfirmDelete(true);
                  setBudgetToDelete(budget);
                }}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {editingBudget && (
        <form onSubmit={handleUpdateBudget} className="space-y-6 mt-8">
          <h3 className="font-semibold text-lg mb-4">Edit Budget for {editingBudget.month}</h3>
          <input
            type="date"
            value={editingBudget.month}
            onChange={(e) => setEditingBudget({ ...editingBudget, month: e.target.value })}
            className="block border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="number"
            value={editingBudget.amount}
            onChange={(e) => setEditingBudget({ ...editingBudget, amount: e.target.value })}
            className="block border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button type="submit" className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
            Update Budget
          </button>
          <button
            type="button"
            onClick={() => setEditingBudget(null)}
            className="w-full py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition"
          >
            Cancel Edit
          </button>
        </form>
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-






ChatGPT said:
50 flex items-center justify-center">
<div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
<h3 className="text-xl font-semibold">Are you sure you want to delete this budget?</h3>
<div className="mt-4 flex justify-between">
<button onClick={handleDeleteBudget} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition" >
Yes, Delete
</button>
<button
onClick={() => setShowConfirmDelete(false)}
className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
>
Cancel
</button>
</div>
</div>
</div>
)}

<div className="mt-6 flex justify-between space-x-4">
        <Link to="/transactions" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          Go to Transactions
        </Link>
        <Link to="/budget" className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
          Go to Category
        </Link>
        <Link to="/" className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-700 transition">
          Go to Dashboard
        </Link>
      </div>
</div>
);
};

export default BudgetManagement;