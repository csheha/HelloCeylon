import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebaseConfig";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
