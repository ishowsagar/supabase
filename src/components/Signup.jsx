import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useActionState } from "react";

const Signup = () => {
  // todo add signup logic with useActionState and signUpUser from context
  const navigate_To_Site_Once_SignedUp = useNavigate();
  const { signUpNewUser } = useAuth();

  const [error, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
      const email = formData.get("email");
      const password = formData.get("password");
      const name = formData.get("name");
      const accountType = formData.get("account-type");

      // * user gets signed up when inputs email,password
      // signUp auth is invoked when user input email and pass to submit
      const {
        success,
        error: signUpError,
        data,
      } = await signUpNewUser(email, password,name,accountType);

      if (signUpError) {
        return new Error(signUpError);
      }

      // *! successfully signup --> navigate user to "/dash..."
      if (success && data?.session) {
        navigate_To_Site_Once_SignedUp("/dashboard");
        return null;
      }
      // * fallback if both conditions fails
      return null;
    },
    null
  );

  return (
    <>
      <h1 className="landing-header">Paper Like A Boss</h1>
      <div className="sign-form-container">
        <form
          action={submitAction} // grab formData to access what user inputs from form els
          aria-label="Sign up form"
          aria-describedby="form-description"
        >
          <div id="form-description" className="sr-only">
            Use this form to create a new account. Enter your email and
            password.
          </div>

          <h2 className="form-title">Sign up today!</h2>
          <p>
            Already have an account?
            <Link className="form-link" to="/">
              Sign in
            </Link>
          </p>

          {/* Name input */}
          <label htmlFor="name">Name</label>
          <input
            className="form-input"
            type="text"
            name="name"
            id="name"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signup-error" : undefined}
            disabled={isPending}
          />

          {/* ! Email input */}
          <label htmlFor="email">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            id="email"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signup-error" : undefined}
            disabled={isPending}
          />

          {/* ! Password input */}
          <label htmlFor="password">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            id="password"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signup-error" : undefined}
            disabled={isPending}
          />

          {/* select account-type input */}
          <fieldset
            className="form-fieldset"
            aria-required="true"
            aria-label="Select your role"
          >
            <legend>Select your role</legend>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="account-type"
                  value="admin"
                  required
                />{" "}
                Admin
              </label>
              <label>
                <input type="radio" name="account-type" value="rep" required />{" "}
                Sales Rep
              </label>
            </div>
          </fieldset>

          {/* ? Submit button */}
          <button
            type="submit"
            className="form-button"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Signing up..." : "Sign up"}
          </button>

          {/*  todo - display error to the user if there is an error */}
          {error && (
            <div
              id="signup-error"
              role="alert"
              className="sign-form-error-message"
            >
              {error.message}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Signup;
