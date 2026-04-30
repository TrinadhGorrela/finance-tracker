import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("Token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default ProtectedRoute;
