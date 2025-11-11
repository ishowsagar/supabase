import { Children } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

//  todo = we are looking for / route, redirect them to dahbaord if user visistes "/" but has session, if not signin/up page
//  ? what if they don't load "/" route buyt "/dash...",
// !they will still load component but would be non-editable table with no data but
// !comp will be still rendered

//  so, we can fix it by setting up a protected route to only render these if session exists
// means only they are allowed to direclty routed if they already have session if not, first log in

export default function ProtectedRoute({children}) {
  const { session } = useAuth();
  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return session ? (
    //* If session exists, render children
    <>{children}</>
  ) : (
    //*   if no session exists, redirect them to /sign-in to sign in first
    <Navigate to="/signin" />
  );
}
