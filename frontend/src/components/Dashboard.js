import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import API from '../services/api';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';

const COLORS = ['#00C49F', '#FF8042', '#0088FE', '#FFBB28'];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get('/transactions/');
        const txns = res.data;
        setTransactions(txns);

        let income = 0;
        let expense = 0;
        const categoryMap = {};
        const monthMap = {};

        txns.forEach(txn => {
          const amt = parseFloat(txn.amount);
          const month = new Date(txn.date).toLocaleString('default', { month: 'short', year: 'numeric' });

          if (txn.type === 'income') income += amt;
          if (txn.type === 'expense') {
            expense += amt;
            categoryMap[txn.category?.name || 'Uncategorized'] = (categoryMap[txn.category?.name] || 0) + amt;
          }

          if (!monthMap[month]) {
            monthMap[month] = { income: 0, expense: 0 };
          }
          monthMap[month][txn.type] += amt;
        });

        setSummary({ income, expense });
        setCategoryData(Object.entries(categoryMap).map(([name, value]) => ({ name, value })));
        setMonthlyData(Object.entries(monthMap).map(([month, values]) => ({
          month,
          income: values.income,
          expense: values.expense,
        })));
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Dashboard</h1>

      {/* Navigation Links */}
      <div className="mb-6 text-center">
        <Link to="/transactions" className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4 hover:bg-blue-600 transition">
          Transactions
        </Link>
        <Link to="/budget" className="bg-green-500 text-white px-4 py-2 rounded-md mr-4 hover:bg-green-600 transition">
          Budget
        </Link>
        <Link to="/category" className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition">
          Category
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-green-100 rounded-xl shadow-lg text-center">
          <h2 className="text-lg font-semibold text-green-600">Income</h2>
          <p className="text-2xl font-bold text-green-800">₹ {summary.income.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-red-100 rounded-xl shadow-lg text-center">
          <h2 className="text-lg font-semibold text-red-600">Expenses</h2>
          <p className="text-2xl font-bold text-red-800">₹ {summary.expense.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-blue-100 rounded-xl shadow-lg text-center">
          <h2 className="text-lg font-semibold text-blue-600">Balance</h2>
          <p className="text-2xl font-bold text-blue-800">₹ {(summary.income - summary.expense).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Income vs Expense Pie */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-center">Income vs Expense</h3>
          <PieChart width={350} height={250}>
            <Pie
              data={[
                { name: 'Income', value: summary.income },
                { name: 'Expense', value: summary.expense },
              ]}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              <Cell fill="#00C49F" />
              <Cell fill="#FF8042" />
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Monthly Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-center">Monthly Trend</h3>
          <BarChart width={500} height={300} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#00C49F" />
            <Bar dataKey="expense" fill="#FF8042" />
          </BarChart>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-center">Category-wise Expenses</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {categoryData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
