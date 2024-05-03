import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./components/authentication/Register";
import Login from "./components/authentication/Login";
import {AuthProvider} from "./contexts/AuthContext";
import ErrorMessage from "./components/layouts/ErrorMessage";
import WithPrivateRoute from "./utils/WithPrivateRoute";
import Dashboard from "./pages/Dashboard"
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/account/Profile";
import Home from "./pages/Home";
import EditRoles from "./components/company/EditRoles";
import AddEmployees from "./components/company/AddEmployees";
import DocumentPage from "./pages/DocumentPage";
import AppLayout from "./components/layouts/AppLayout";

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppLayout>
                <ErrorMessage/>
                <Routes>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/verify-email" element={<VerifyEmail />}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/"
                        element={
                            <WithPrivateRoute>
                                <Dashboard/>
                            </WithPrivateRoute>
                        }
                    />
                    <Route
                        path="/edit-roles"
                        element={
                            <WithPrivateRoute>
                                <EditRoles/>
                            </WithPrivateRoute>
                        }
                    />
                    <Route
                        path="/add-employees"
                        element={
                            <WithPrivateRoute>
                                <AddEmployees/>
                            </WithPrivateRoute>
                        }
                    />

                    <Route
                        exact
                        path="/profile"
                        element={
                            <WithPrivateRoute>
                                <Profile/>
                            </WithPrivateRoute>
                        }
                    />
                    <Route
                        exact
                        path="/dashboard"
                        element={
                        <WithPrivateRoute>
                            <Dashboard/>
                        </WithPrivateRoute>}
                    />
                    <Route
                        exact
                        path="/document/:documentId"
                        element={
                        <WithPrivateRoute>
                            <DocumentPage />
                        </WithPrivateRoute>
                    }/>
                    <Route path="*" element={<h1>Not Found</h1>}/>
                </Routes>
                </AppLayout>
            </Router>
        </AuthProvider>
    );
}

export default App;
