
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function App() {

  // 1. All States for Inputs and Data
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("my_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Salary");

  const [filterCategory, setFilterCategory] = useState("All");

  // LocalStorage 
  useEffect(() => {
    localStorage.setItem("my_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Automated Calculations 
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  // Pie Chart Data (Expense Categories)

  const expenseChartData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.name === curr.category);

      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({
          name: curr.category,
          value: curr.amount,
        });
      }

      return acc;
    }, []);

  // Monthly Trend Data

  const monthlyData = transactions.reduce((acc, curr) => {
    const month = new Date(curr.id).toLocaleString("default", {
      month: "short",
    });

    let existing = acc.find((item) => item.month === month);

    if (!existing) {
      existing = {
        month,
        income: 0,
        expense: 0,
      };

      acc.push(existing);
    }

    if (curr.type === "income") {
      existing.income += curr.amount;
    } else {
      existing.expense += curr.amount;
    }

    return acc;
  }, []);

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#EF4444",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
  ];



  // Filtered Transactions for History Display
  const displayedTransactions =
    filterCategory === "All"
      ? transactions
      : transactions.filter((t) => t.category === filterCategory);


  //  Add Transaction Function
  const handleAddTransaction = (e) => {
    e.preventDefault();

    if (!title || !amount) {
      alert("Yar, please title aur amount dono enter karein!");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      title: title,
      amount: parseFloat(amount),
      type: type,
      category: category,
    };

    setTransactions([...transactions, newTransaction]);
    setTitle("");
    setAmount("");
  };

  // 5. Delete Transaction Function
  const handleDelete = (id) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-center font-bold text-3xl mb-6 text-gray-800">
        Expense Tracker
      </h1>

      {/*  TOP SECTION: DASHBOARD  */}
      <div className="grid grid-cols-3 gap-2 text-center mb-6">
        <div className="bg-blue-100 p-3 rounded-lg border border-blue-200">
          <span className="block text-xs font-semibold text-blue-700">BALANCE</span>
          <span className="text-lg font-bold text-blue-900">Rs. {balance}</span>
        </div>
        <div className="bg-green-100 p-3 rounded-lg border border-green-200">
          <span className="block text-xs font-semibold text-green-700">INCOME</span>
          <span className="text-lg font-bold text-green-900">Rs. {income}</span>
        </div>
        <div className="bg-red-100 p-3 rounded-lg border border-red-200">
          <span className="block text-xs font-semibold text-red-700">EXPENSE</span>
          <span className="text-lg font-bold text-red-900">Rs. {expense}</span>
        </div>
      </div>

      {/*  MIDDLE SECTION: INPUT FORM  */}
      <form
        onSubmit={handleAddTransaction}
        className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6"
      >
        <h2 className="font-bold text-lg text-gray-700">Add New Transaction</h2>

        <input
          className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-black text-sm"
          type="text"
          placeholder="Transaction Title (e.g., Office Salary, Biryani)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-black text-sm"
          type="number"
          placeholder="Amount (Rs.)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-black text-sm bg-white"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-black text-sm bg-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Salary">Salary</option>
          <option value="Food">Food</option>
          <option value="Shopping">Shopping</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Others">Others</option>
        </select>

        <button
          type="submit"
          className="bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mt-2 text-sm"
        >
          Add Transaction
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-5 mb-6">

        {/* Pie Chart */}

        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="font-bold mb-4">
            Expense By Category
          </h2>
          {expenseChartData.length === 0 ? (
            <p>No expense data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseChartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {expenseChartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  }}
                  itemStyle={{
                    color: "#111827",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  labelStyle={{
                    color: "#6b7280",
                    fontWeight: "700",
                    marginBottom: "6px",
                  }}
                  formatter={(value) => [`Rs. ${value}`, "Amount"]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-4">
            Monthly Income vs Expense
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="income"
                fill="#10B981"
              />

              <Bar
                dataKey="expense"
                fill="#EF4444"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/*  BOTTOM SECTION: TRANSACTIONS LIST WITH CATEGORY FILTER  */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        {/* Header containing Title & Filter Options */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-700">History</h2>

          {/* Category Dropdown Filter */}
          <select
            className="border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-gray-700 focus:outline-none focus:border-black"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Salary">Salary</option>
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {transactions.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            {filterCategory === "All"
              ? "There is no Transactions"
              : `"${filterCategory}" There is no transaction in this category`}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {transactions.map((t) => (
              <div
                key={t.id}
                className={`flex items-center justify-between p-3 rounded-lg border text-sm ${t.type === "income"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
                  }`}
              >
                <div>
                  <p className="font-bold text-gray-800">{t.title}</p>
                  <span className="text-xs text-gray-500 uppercase font-semibold">
                    {t.category} ({t.type})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold ${t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {t.type === "income" ? "+" : "-"} Rs. {t.amount}
                  </span>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-gray-400 hover:text-red-600 font-bold px-1 text-base transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


