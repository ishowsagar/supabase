import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// ! useNavigate is imperative ( trigged by some function or interction by users)
// ! while, Navigate is declarative means we explicility redirect them to somewhere.
export default function RootRedirect() {
  const { session } = useAuth(); 

  if (session === undefined) {
    return <div>Loading...</div>;
  }
  //   we user here Navigate, not useNavigate, because we useNavigate when we have to redirect users via
  // some function or conditions that will be triggered by them

  //?null = signin, ?data coming = /dashboard
  //   ! based on conditions it will redirect them to these routes to render these components
  return session ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />;
}
