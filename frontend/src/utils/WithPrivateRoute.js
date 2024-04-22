import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const WithPrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();

  if(currentUser){
    return children;
  }

    // If there is a current user it will render the passed down component
/*
    if (currentUser && currentUser.emailVerified) {
        return children;
    } else if (currentUser && !currentUser.emailVerified) {
        return <Navigate to="/verify-email" />;
    }
*/

    // Otherwise redirect to the login route
    return <Navigate to="/login" />;
};

export default WithPrivateRoute;