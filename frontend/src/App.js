import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./components/authentication/Register";
import Login from "./components/authentication/Login";
import {AuthProvider} from "./contexts/AuthContext";
import ErrorMessage from "./components/layouts/ErrorMessage";
import Header from "./components/layouts/Header";
import WithPrivateRoute from "./utils/WithPrivateRoute";
import Profile from "./pages/account/Profile";
import VerifyEmail from "./pages/account/VerifyEmail";

import Home from "./pages/Home";


function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <ErrorMessage />
                <Routes>
                    <Route path="/register" element={<Register />}/>
                    <Route path="/login" element={<Login />}/>
                    <Route
                        exact
                        path="/"
                        element={
                            <WithPrivateRoute>
                                <Home />
                            </WithPrivateRoute>
                        }
                    />
                    <Route
                        exact
                        path="/profile"
                        element={
                            <WithPrivateRoute>
                                <Home />
                            </WithPrivateRoute>
                        }
                    />
                    <Route path="/verify-email" element={<VerifyEmail />}/>
                    <Route path="*" element={<h1>Not Found</h1>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
