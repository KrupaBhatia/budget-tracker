import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    amount: '',
    type: 'expense',
    category: '',
    date: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchTransactions = async () => {
    const res = await API.get('/transactions/');
    setTransactions(res.data);
  };

  const fetchCategories = async () => {
    const res = await API.get('/categories/');
    setCategories(res.data);
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const payload = { ...formData, user: userId };

      if (isEditing) {
        await API.put(`/transactions/${formData.id}/`, payload);
        setIsEditing(false);
      } else {
        await API.post('/transactions/', payload);
      }

      setFormData({
        id: null,
        amount: '',
        type: 'expense',
        category: '',
        date: '',
        description: ''
      });
      fetchTransactions();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleEdit = (txn) => {
    setFormData({
      id: txn.id,
      amount: txn.amount,
      type: txn.type,
      category: txn.category,
      date: txn.date,
      description: txn.description
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}/`);
      fetchTransactions();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
        {isEditing ? 'Edit' : 'Add'} Transaction
      </h1>

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="block border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="block border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="block border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="block border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="block border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          {isEditing ? 'Update' : 'Add'} Transaction
        </button>
      </form>

      {/* Transaction List */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Transaction List</h2>
        <ul className="space-y-4">
          {transactions.map((txn) => (
            <li key={txn.id} className="border border-gray-300 p-4 rounded-lg flex justify-between items-center hover:bg-gray-100 transition">
              <div>
                <strong className={`${txn.type === 'income' ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                  {txn.type.toUpperCase()}
                </strong> 
                ₹{txn.amount} - {txn.description} ({txn.date})
              </div>
              <div className="space-x-3">
                <button onClick={() => handleEdit(txn)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
                  Edit
                </button>
                <button onClick={() => handleDelete(txn.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation Links */}
      <div className="mt-6 flex justify-between">
        <Link to="/categories" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Go to Categories</Link>
        <Link to="/budget" className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Go to Budget</Link>
        <Link to="/" className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-700 transition">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default TransactionPage;
