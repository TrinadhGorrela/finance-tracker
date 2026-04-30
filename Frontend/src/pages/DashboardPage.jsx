import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import transactionService from "../api/transactionService";
import userService from "../api/userService";
import styles from "./DashboardPage.module.css";

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(null);
  const [budgetStatus, setBudgetStatus] = useState("");
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF1919",
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await transactionService.getTransactions();
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchBudgetStatus = async () => {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const data = await transactionService.getSummary(currentMonth);
      setBudgetStatus(data.budgetStatus);
    };
    fetchBudgetStatus();
  }, []);

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "EXPENSE",
  );

  const expenseTotals = expenseTransactions.reduce((tally, transaction) => {
    const categoryName = transaction.category?.name || "Uncategorized";

    tally[categoryName] = (tally[categoryName] || 0) + transaction.amount;
    return tally;
  }, {});

  const expenseData = Object.keys(expenseTotals).map((key) => ({
    name: key,
    value: expenseTotals[key],
  }));



  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!budget || isNaN(budget) || Number(budget) < 0) {
      alert("Please enter a valid positive budget amount.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      await userService.updateUserBudget(userId, budget);
      alert("Budget saved successfully!");
      
      const currentMonth = new Date().toISOString().slice(0, 7);
      const data = await transactionService.getSummary(currentMonth);
      setBudgetStatus(data.budgetStatus);
    } catch (error) {
      console.error("Failed to save budget: ", error);
    }
  };

  return (
    <div className="page-container">
      <h1 className={styles.heading}>Dashboard</h1>
      <div className={`${styles.budgetStatus} ${styles[budgetStatus.toLowerCase()] || ""}`}>
        Budget Status: {budgetStatus.toUpperCase()}
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Income</div>
          <div className={`${styles.statAmount} ${styles.amountIncome}`}>₹{totalIncome}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Expense</div>
          <div className={`${styles.statAmount} ${styles.amountExpense}`}>₹{totalExpense}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Balance</div>
          <div
            className={`${styles.statAmount} ${balance >= 0 ? styles.amountBalancePositive : styles.amountBalanceNegative}`}
          >
            ₹{balance}
          </div>
        </div>
      </div>

      <div className={styles.chartCard}>
        <h3>Expenses by Category</h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expenseData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {expenseData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="form-group">
          <h3 className={styles.centerText}>Set Monthly Budget</h3>
          <input
            type="number"
            placeholder="Enter Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
        <button className={`btn btn-primary ${styles.submitBtn}`} onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
