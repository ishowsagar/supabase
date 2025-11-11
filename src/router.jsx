import { createBrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./routes/Dashboard";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import RootRedirect from "./routes/RootRedirect";
import ProtectedRoute from "./components/ProtectedRoute";

// todo : before loading anything, check for session exists or not

// its like a bg check, it will wil first check for users in bg do they have session?

//  ? if yes --> redirect them to dashboard
// ? if not, sign in page load ffor them.

export const router = createBrowserRouter([
  {
    // ! redirect user to routes based on if session exists or not
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: (
      <>
        {/* if user directly navigates to "/dash.." , 
        we will only render its children or dashbaord if session exists.*/}
        <ProtectedRoute>
          <Header />
          <Dashboard />
        </ProtectedRoute>
      </>
    ),
  },
]);
