import Chatbot from "../components/Chatbot";
import { auth } from "../firebase/firebaseConfig";
import "../style/Home.css";

export default function Home() {
  const getUserInitials = () => {
    const user = auth.currentUser;
    if (user?.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2);
    }
    if (user?.email) {
      return user.email.substring(0, 2);
    }
    return "U";
  };

  const getDisplayName = () => {
    return (
      auth.currentUser?.displayName?.split(" ")[0] ||
      auth.currentUser?.email?.split("@")[0] ||
      "User"
    );
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="welcome-section">
          <h2 className="welcome-text">Welcome, {getDisplayName()}</h2>
          <p className="welcome-subtitle">
            Your personal Sri Lanka travel guide
          </p>
        </div>
        <div className="header-controls">
          <div className="user-avatar">{getUserInitials()}</div>
          <button className="logout-button" onClick={() => auth.signOut()}>
            Logout
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="chatbot-wrapper">
          <Chatbot />
        </div>
      </main>
    </div>
  );
}
