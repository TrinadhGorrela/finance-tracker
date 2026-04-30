import React, { useState, useEffect } from "react";
import transactionService from "../api/transactionService";
import styles from "./TransactionPage.module.css";

function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const getTransactions = async () => {
      const data = await transactionService.getCategories();
      setCategories(data);
    };

    getTransactions();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await transactionService.getTransactions();
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transactionData = {
      note: note.trim(),
      amount: parseFloat(amount),
      category: { id: categoryId },
      type: type.toUpperCase(),
      transactionDate: date,
    };

    if (
      !transactionData.note ||
      isNaN(transactionData.amount) ||
      !categoryId ||
      !type ||
      !date
    ) {
      setError("Please enter all required fields.");
      return;
    }

    if (editingId == null) {
      try {
        const savedTransaction =
          await transactionService.addTransaction(transactionData);

        setTransactions([...transactions, savedTransaction]);

        setNote("");
        setAmount("");
        setDate("");
        setError("");
      } catch (error) {
        setError("Transaction failed to add: " + error.message);
      }
    } else {
      try {
        const updatedTransaction = await transactionService.updateTransaction(
          editingId,
          transactionData,
        );

        setTransactions(
          transactions.map((transaction) =>
            transaction.id === editingId ? updatedTransaction : transaction,
          ),
        );

        setNote("");
        setAmount("");
        setDate("");
        setError("");
        setEditingId(null);
      } catch (error) {
        setError("Update failed: " + error.message);
      }
    }
  };

  const handleClick = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id),
      );
    } catch (error) {
      setError("Deletion failed: " + error.message);
    }
  };

  const handleEdit = (transaction) => {
    setNote(transaction.note);
    setAmount(transaction.amount);
    setCategoryId(transaction.category?.id || "");
    setType(transaction.type?.toLowerCase() || "");
    setDate(transaction.transactionDate || "");
    setEditingId(transaction.id);
  };

  const totalBalance = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + transaction.amount, 0) -
    transactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce((total, transaction) => total + transaction.amount, 0);

  return (
    <div className="page-container">
      <h2 className={`${styles.balanceHeading} ${totalBalance >= 0 ? styles.balancePositive : styles.balanceNegative}`}>
        Total Balance: ₹{totalBalance}
      </h2>

      <div className={styles.layoutContainer}>
        <div className={styles.formSection}>
          <div className={`card ${styles.formCard}`}>
        <h1 className={styles.heading}>Transaction Page</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}

          <div className="form-group">
            <label>Note: </label>
            <input
              type="text"
              name="note"
              value={note}
              placeholder="Enter Note"
              onChange={(e) => setNote(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount: </label>
            <input
              type="number"
              name="amount"
              value={amount}
              placeholder="Enter Amount"
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Date: </label>
            <input
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Category: </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a Category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Type: </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Type
              </option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

            <button className={`btn btn-primary ${styles.submitBtn}`} type="submit">Enter</button>
          </form>
        </div>
      </div>
      
      <div className={styles.listSection}>
        <h3 className={styles.listHeading}>Recent Transactions</h3>
        <ul className={styles.transactionList}>
          {transactions.map((transaction) => (
            <li key={transaction.id} className={styles.transactionItem}>
              <div>
                <strong>{transaction.note}</strong>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {transaction.transactionDate} • {transaction.category?.name || 'General'} • {transaction.type}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontWeight: 'bold', color: transaction.type === 'INCOME' ? 'var(--success-color)' : 'var(--danger-color)' }}>
                  {transaction.type === 'INCOME' ? '+' : '-'}₹{transaction.amount}
                </span>
                <div className={styles.transactionActions}>
                  <button className="btn btn-secondary" onClick={() => handleEdit(transaction)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleClick(transaction.id)}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  );
}
export default TransactionPage;
