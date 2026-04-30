import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("Token");
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
      </div>
      <button className={`btn ${styles.btnLogout}`} onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
