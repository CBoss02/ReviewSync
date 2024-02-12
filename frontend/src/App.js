import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./components/authentication/Register";
import Login from "./components/authentication/Login";
import {AuthProvider} from "./contexts/AuthContext";
import ErrorMessage from "./components/layouts/ErrorMessage";
import Header from "./components/layouts/Header";
import WithPrivateRoute from "./utils/WithPrivateRoute";
import Profile from "./components/account/Profile";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <ErrorMessage />
                <Routes>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route
                        exact
                        path="/profile"
                        element={
                            <WithPrivateRoute>
                                <Profile />
                            </WithPrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
