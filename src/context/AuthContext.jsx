import { useState, createContext, useContext, useEffect } from "react";
import supabase from "../supabase-client";
const AuthContext = createContext();

//* render its children and provide access to session state
export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [users, setUsers] = useState([]);

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

  // ! fetching users from user_profiles table which get populated from user having user metadata only👇
  //  todo -  whenever someone logs in, logs out, or the session updates, you get fresh user data
  //* whenever component first mounts and whenever session changes, re-run this
  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("id,name,account_type");
        if (error) {
          throw error; // * throw the Supabase error directly
        }
        console.log(data);
        // ! users state var - stores data from user_profiles --> name,id,account_type
        setUsers(data);
      } catch (err) {
        console.error("error fetching users:", err);
      }
    }
    fetchUsers();
  }, [session]);

  //!Auth functions (signin, signup, logout)

  //  todo checks when we pass user that has logged in or not,
  const signInUser = async (email, password) => {
    //  but we will call in signin as there we are getting user email n pass

    // * authenticate user if have  this inputted this email/pass

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

  //*Auth user (signup)
  // ! sign up user and authenticate him and load site without have to sign in.
  const signUpNewUser = async (email, password, name, accountType) => {
    try {
      // * log what we're sending to debug
      console.log("Signing up with:", { email, name, accountType });

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password,
        options: {
          data: {
            name: name,
            account_type: accountType,
          },
        },
      });
      if (error) {
        console.error("Supabase sign-up error:", error.message);
        console.error("Full error:", error);
        return { success: false, error: error.message };
      }
      console.log("Supabase sign-up success:", data);
      console.log("User metadata:", data.user?.user_metadata);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error during sign-up:", error.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, signInUser, signOut, signUpNewUser, users }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// whatever is passed like here state --> when gets called -> returns this
export const useAuth = () => {
  return useContext(AuthContext);
};
