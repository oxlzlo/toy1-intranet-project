import { Navigate } from "react-router-dom";
import { auth } from "../firebase/config";

function ProtectedPage({ children }) {
  const userLogin = auth.currentUser;
  if (!userLogin) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedPage;
