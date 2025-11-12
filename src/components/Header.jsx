import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Header: top banner and title for the dashboard
function Header() {
  const { signOut, session, users } = useAuth();
  const [error, setError] = useState(null);
  const navigateBackToLandingPage = useNavigate();

  // ! look for user who is currently live-on-site
  const currentUser = users.find((user) => user?.id === session?.user?.id);

  // ! handle sign out action
  const handleSignOut = async (e) => {
    e.preventDefault();
    const { success, error } = await signOut();
    if (success) {
      // ? navigate to "/" (home/signin page)
      navigateBackToLandingPage("/");
    } else {
      setError(error.message);
    }
  };

  const accountTypeMap = {
    rep: "Sales rep",
    admin: "Admin",
  };

  const displayAccountType = currentUser?.account_type
    ? accountTypeMap[currentUser.account_type]
    : "";

  return (
    <>
      <header role="banner" aria-label="Dashboard header">
        <div
          className="header-enail"
          role="navigation"
          aria-label="User account navigation"
        >
          <h2>
            <span className="sr-only">Logged in as :</span>
            {currentUser?.name} ({displayAccountType})
          </h2>
          <button onClick={handleSignOut} aria-label="Sign out of your account">
            Sign out
          </button>
          {error && (
            <div role="role" className="error-message" id="signout-error">
              {error}
            </div>
          )}
        </div>
        <h1>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: "8px" }}
            aria-hidden="true"
            role="img"
            aria-label="Dashboard icon"
          >
            <path
              d="M12 2v8M12 14v8M4.93 4.93l5.66 5.66M13.41 13.41l5.66 5.66M2 12h8M14 12h8M4.93 19.07l5.66-5.66M13.41 10.59l5.66-5.66"
              stroke="#29d952"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <span>Sales Team Dashboard</span>
        </h1>
      </header>
    </>
  );
}

export default Header;
