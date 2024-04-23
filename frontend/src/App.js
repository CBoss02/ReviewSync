import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./components/authentication/Register";
import Login from "./components/authentication/Login";
import {AuthProvider} from "./contexts/AuthContext";
import ErrorMessage from "./components/layouts/ErrorMessage";
import Header from "./components/layouts/Header";
import DocumentUpload from "./components/document/DocumentUpload"
import WithPrivateRoute from "./utils/WithPrivateRoute";
import Dashboard from "./pages/Dashboard"
import VerifyEmail from "./pages/VerifyEmail";
import Home from "./pages/Home";
import EditRoles from "./components/company/EditRoles";
import AddEmployees from "./components/company/AddEmployees";
import DocumentPage from "./pages/DocumentPage";
import Profile from "./pages/Profile";
import AppLayout from "./components/layouts/AppLayout";
import Footer from "./components/layouts/Footer";

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppLayout>
                <ErrorMessage/>
                <Routes>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route
                        exact
                        path="/"
                        element={
                            <WithPrivateRoute>
                                <Home/>
                            </WithPrivateRoute>
                        }
                    />

                    <Route path="/edit-roles" element={<EditRoles/>}/>
                    <Route path="/add-employees" element={<AddEmployees/>}/>
                    <Route
                        exact
                        path="/profile"
                        element={
                            <WithPrivateRoute>
                                <Profile />
                            </WithPrivateRoute>
                        }
                    />
                    <Route path="/verify-email" element={<VerifyEmail/>}/>
                    <Route
                        exact
                        path="/dashboard"
                        element={<WithPrivateRoute><Dashboard/></WithPrivateRoute>}
                    />
                    <Route
                        exact
                        path="/document/:documentId"
                        element={
                        <WithPrivateRoute>
                            <DocumentPage />
                        </WithPrivateRoute>
                    }/>

                    <Route path="/verify-email" element={<VerifyEmail />}/>
                    <Route path="/dashboard" element={<Dashboard />}/>
                    <Route path="*" element={<h1>Not Found</h1>}/>
                </Routes>
                </AppLayout>
            </Router>
        </AuthProvider>
    );
}

export default App;
