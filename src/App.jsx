
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
    "#0F766E",
    "#D97706",
    "#BE123C",
    "#4F46E5",
    "#65A30D",
    "#78716C",
  ];

  // Filtered Transactions for History Display
  const displayedTransactions =
    filterCategory === "All"
      ? transactions
      : transactions.filter((t) => t.category === filterCategory);

  // Add Transaction Function
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

  // UI-only helper classes
  const inputClass =
    "w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20";

  const labelClass = "mb-1.5 block text-sm font-medium text-stone-600";

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-800">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        {/* HEADER */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Expense Tracker
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Apni income aur kharchay ek jagah track karein.
          </p>
        </header>

        {/* SUMMARY */}
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-teal-900 p-6 text-white md:col-span-1">
            <p className="text-sm text-teal-200">Current balance</p>
            <p
              className={`mt-2 text-3xl font-bold tabular-nums sm:text-4xl ${balance < 0 ? "text-rose-300" : "text-white"
                }`}
            >
              Rs. {balance}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-6">
            <div>
              <p className="text-sm text-stone-500">Total income</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-teal-700">
                Rs. {income}
              </p>
            </div>
            <span className="h-10 w-1.5 rounded-full bg-teal-600" />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-6">
            <div>
              <p className="text-sm text-stone-500">Total expense</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-rose-700">
                Rs. {expense}
              </p>
            </div>
            <span className="h-10 w-1.5 rounded-full bg-rose-600" />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT: FORM */}
          <form
            onSubmit={handleAddTransaction}
            className="h-fit rounded-2xl border border-stone-200 bg-white p-6 lg:sticky lg:top-6"
          >
            <h2 className="mb-5 text-lg font-semibold text-stone-900">
              Add transaction
            </h2>

            <div className="mb-4">
              <span className={labelClass}>Type</span>
              <div className="grid grid-cols-2 gap-1 rounded-lg bg-stone-100 p-1">
                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`rounded-md py-2 text-sm font-semibold transition-colors ${type === "income"
                      ? "bg-teal-700 text-white"
                      : "text-stone-600 hover:text-stone-900"
                    }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`rounded-md py-2 text-sm font-semibold transition-colors ${type === "expense"
                      ? "bg-rose-700 text-white"
                      : "text-stone-600 hover:text-stone-900"
                    }`}
                >
                  Expense
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className={labelClass} htmlFor="title">
                Title
              </label>
              <input
                id="title"
                className={inputClass}
                type="text"
                placeholder="e.g. Office salary, Biryani"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className={labelClass} htmlFor="amount">
                Amount (Rs.)
              </label>
              <input
                id="amount"
                className={inputClass}
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className={labelClass} htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className={inputClass}
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
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-teal-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
            >
              Add transaction
            </button>
          </form>

          {/* RIGHT: CHARTS + HISTORY */}
          <div className="flex flex-col gap-6 lg:col-span-2">

            <div className="grid gap-6 md:grid-cols-2">

              {/* Pie Chart */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-stone-900">
                  Expense by category
                </h2>
                {expenseChartData.length === 0 ? (
                  <div className="flex h-65 items-center justify-center rounded-lg border border-dashed border-stone-300 px-4 text-center text-sm text-stone-400">
                    Koi expense add karein, chart yahan nazar aayega.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={expenseChartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={90}
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
                          border: "1px solid #e7e5e4",
                          borderRadius: "12px",
                          padding: "12px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                        }}
                        itemStyle={{
                          color: "#1c1917",
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                        labelStyle={{
                          color: "#78716c",
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
              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-stone-900">
                  Monthly income vs expense
                </h2>
                {monthlyData.length === 0 ? (
                  <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-stone-300 px-4 text-center text-sm text-stone-400">
                    Pehli transaction add karein, monthly chart ban jayega.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="income" fill="#0F766E" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" fill="#BE123C" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* HISTORY */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-stone-900">History</h2>

                <select
                  aria-label="Filter by category"
                  className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">All categories</option>
                  <option value="Salary">Salary</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {displayedTransactions.length === 0 ? (
                <p className="rounded-lg border border-dashed border-stone-300 py-8 text-center text-sm text-stone-400">
                  {filterCategory === "All"
                    ? "Abhi koi transaction nahi hai. Left side se pehli add karein."
                    : `"${filterCategory}" category mein koi transaction nahi hai.`}
                </p>
              ) : (
                <ul className="divide-y divide-stone-200">
                  {displayedTransactions.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`h-9 w-1.5 shrink-0 rounded-full ${t.type === "income" ? "bg-teal-600" : "bg-rose-600"
                            }`}
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-stone-900">
                            {t.title}
                          </p>
                          <p className="text-xs text-stone-500">
                            {t.category} • {new Date(t.id).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span
                          className={`font-semibold tabular-nums ${t.type === "income" ? "text-teal-700" : "text-rose-700"
                            }`}
                        >
                          {t.type === "income" ? "+" : "-"} Rs. {t.amount}
                        </span>

                        <button
                          onClick={() => handleDelete(t.id)}
                          aria-label={`Delete ${t.title}`}
                          className="rounded-md border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-500 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
