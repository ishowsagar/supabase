// Form: UI for adding a new sales deal (submits to Supabase)
import { useActionState } from "react";
import supabase from "../supabase-client";
import { useAuth } from "../context/AuthContext";

function Form() {
  const { users, session } = useAuth();

  // ? handle form submission with async action
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      // inpuutted name in the form submitting time
      const submittedName = formData.get("name");

      //  ? does that submitted name exists in users which have all data of logged inusers with id,name and acc_type as always
      const user = users.find((user) => user.name === submittedName);
      // ! get form values
      const newDeal = {
        // !IMPORTANT - fetching id from user found in user_profiles data who is signed in
        user_id: user.id,
        value: formData.get("value"),
      };
      console.log(newDeal);

      // todo insert new deal into Supabase
      const { error } = await supabase.from("sales_deals").insert(newDeal);
      if (error) {
        console.error("Error adding deal: ", error.message);
        return new Error("Failed to add deal");
      }

      return null; // success
    },
    null // Initial state
  );

  // ! finding current user who is live-on-site
  // ? optinal chaining to check for it does not cause any runtime errors
  //  its like saying --> does session exist? exists -->
  // return its user property --> does prop exists --> return that
  const currentUser = users.find((user) => user.id === session?.user?.id);

  // generate dropdown options from user_profiles table(whihc has name,id,acc_type info cols )
  // mapping over each user in user_profiles table to generate options in select menu for each name
  const generateOptions = () => {
    return (
      users
        // ! we just want 'rep' names in options 👇,
        // *to filter out unwanted Admin data
        // .filter((user) => user.account_type === "rep")
        .map((user) => {
          return (
            <option key={user.id} value={user.name}>
              {user.name}
            </option>
          );
        })
    );
  };

  return (
    <div className="add-form-container">
      <form
        action={submitAction}
        aria-label="Add new sales deal"
        aria-describedby="form-description"
      >
        <div id="form-description" className="sr-only">
          Use this form to add a new sales deal. Select a sales rep and enter
          the amount.
        </div>

        {currentUser?.account_type === "rep" ? (
          <label htmlFor="deal-name">
            Name:
            <input
              id="deal-name"
              name="name"
              type="text"
              value={currentUser?.name || ""}
              readOnly="true"
              className="rep-name-input"
              aria-label="Sales representive name"
              aria-readonly="true"
            />
          </label>
        ) : (
          <label htmlFor="deal-name">
            Name:
            <select
              id="deal-name"
              name="name"
              defaultValue={users?.[0]?.name || ""}
              aria-required="true"
              aria-invalid={error ? "true" : "false"}
              disabled={isPending}
            >
              {generateOptions()}
            </select>
          </label>
        )}

        <label htmlFor="deal-value">
          Amount: $
          <input
            id="deal-value"
            type="number"
            name="value"
            defaultValue={0}
            className="amount-input"
            min="0"
            step="10"
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-label="Deal amount in dollars"
            disabled={isPending}
          />
        </label>

        <button type="submit" disabled={isPending} aria-busy={isPending}>
          {isPending ? "Adding..." : "Add Deal"}
        </button>
      </form>

      {error && (
        <div role="alert" className="error-message">
          {error.message}
        </div>
      )}
    </div>
  );
}

export default Form;
