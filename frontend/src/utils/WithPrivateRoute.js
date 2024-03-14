import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const WithPrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();

    // If there is a current user and user is email verified then render the children (protected route) else redirect to the pre-verification route
    if (currentUser && currentUser.emailVerified) {
        return children;
    } else if (currentUser && !currentUser.emailVerified) {
        return <Navigate to="/verify-email" />;
    }

    // Otherwise redirect to the login route
    return <Navigate to="/login" />;
};

export default WithPrivateRoute;