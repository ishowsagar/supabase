// Form: UI for adding a new sales deal (submits to Supabase)
import { useActionState } from "react";
import supabase from "../supabase-client";

function Form({ metrics }) {
  // ? handle form submission with async action
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      // ! get form values
      const newDeal = {
        name: formData.get("name"),
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

  // generate dropdown options from metrics
  const generateOptions = () => {
    return metrics.map((metric) => (
      <option key={metric.name} value={metric.name}>
        {metric.name}
      </option>
    ));
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

        <label htmlFor="deal-name">
          Name:
          <select
            id="deal-name"
            name="name"
            defaultValue={metrics?.[0]?.name || ""}
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            disabled={isPending}
          >
            {generateOptions()}
          </select>
        </label>

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
