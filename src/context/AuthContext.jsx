import { useState, createContext, useContext, useEffect } from "react";
import supabase from "../supabase-client";
const AuthContext = createContext();

// render its children and provide access to session state
export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    async function getInitialSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }

        console.log(data.session);
        setSession(data.session);
      } catch (error) {
        console.error("Error getting session :", error);
      }
    }
    getInitialSession();
    //2) Listen for changes in auth state (.onAuthStateChange())
    supabase.auth.onAuthStateChange((__event, session) => {
      setSession(session);
      console.log("session changed :", session);
    });
  }, []);

  //Auth functions (signin, signup, logout)

  //  todo checks when we pass user that has logged in or not,
  const signInUser = async (email, password) => {
    //  but we will call in signin as there we are getting user email n pass

    // ! authenticate user if have  this inputted this email/pass

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      // ? if an error occurs :
      if (error) {
        console.error("Supabase sign-in error:", error.message);
        return { success: false, error: error.message };
      }

      //  ? if not, do this normally :
      console.log("Supabase sign-in success:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error during sign-in:", error.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  //Auth functions (signup, logout)
  // ! sign out user and clear session
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase sign-out error:", error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error("Unexpected error during sign-out:", error.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ session, signInUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// whatever is passed like here state --> when gets called -> returns this
export const useAuth = () => {
  return useContext(AuthContext);
};
