import { useState } from "react";
import "./App.css";
import { calculatePremium } from "./utils/premiumCalculator";

function App() {
const [formData, setFormData] = useState({
customerName: "",
coverType: "",
applicant1Age: "",
applicant1History: "",
applicant2Age: "",
applicant2History: "",
hospitalCover: "",
extrasCover: "",
paymentFrequency: "Monthly",
annualDiscount: 5,
notes: "",
});

const [quoteResult, setQuoteResult] = useState(null);
const [error, setError] = useState("");
const [message, setMessage] = useState("");

const handleChange = (event) => {
const { name, value } = event.target;

setFormData((previousData) => ({
  ...previousData,
  [name]: value,
}));

setError("");
setMessage("");

};

const validateForm = () => {
if (!formData.customerName.trim()) {
return "Please enter the customer name.";
}

if (!formData.coverType) {
  return "Please select a cover type.";
}

if (!formData.applicant1Age) {
  return "Please enter Applicant 1's age.";
}

const applicant1Age = Number(formData.applicant1Age);

if (applicant1Age < 18 || applicant1Age > 100) {
  return "Applicant 1's age must be between 18 and 100.";
}

if (!formData.applicant1History) {
  return "Please select Applicant 1's hospital cover history.";
}

if (
  formData.coverType === "Couple" ||
  formData.coverType === "Family"
) {
  if (!formData.applicant2Age) {
    return "Please enter Applicant 2's age.";
  }

  const applicant2Age = Number(formData.applicant2Age);

  if (applicant2Age < 18 || applicant2Age > 100) {
    return "Applicant 2's age must be between 18 and 100.";
  }

  if (!formData.applicant2History) {
    return "Please select Applicant 2's hospital cover history.";
  }
}

if (!formData.hospitalCover) {
  return "Please select hospital cover.";
}

if (!formData.extrasCover) {
  return "Please select extras cover.";
}

const discount = Number(formData.annualDiscount);

if (discount < 0 || discount > 10) {
  return "Annual discount must be between 0% and 10%.";
}

return "";

};

const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");
  setMessage("");
  setQuoteResult(null);

  const validationError = validateForm();

  if (validationError) {
    setError(validationError);
    return;
  }

  try {
    const result = calculatePremium(formData);

    console.log("Quote calculated:", result);

    const response = await fetch("http://localhost:5000/api/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to save quote.");
    }

    console.log("Quote saved:", data);

    setQuoteResult(result);
    setMessage("Quote calculated and saved successfully.");
  } catch (error) {
    console.error("Quote error:", error);

    setError(
      error.message ||
        "Unable to calculate or save the quote. Please try again."
    );
  }
};

return ( <div className="app"> <header className="header"> <h1>HealthCoverSim</h1> <p>Private Health Insurance Quote Simulator</p> </header>

  <main className="container">
    <section className="hero">
      <h2>Get an estimated health insurance quote</h2>

      <p>
        Enter your details below to calculate an estimated
        insurance premium.
      </p>
    </section>

    <form className="card" onSubmit={handleSubmit}>
      <h2>Create a Quote</h2>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="customerName">
            Customer name
          </label>

          <input
            id="customerName"
            name="customerName"
            type="text"
            placeholder="Enter customer name"
            value={formData.customerName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="coverType">
            Cover type
          </label>

          <select
            id="coverType"
            name="coverType"
            value={formData.coverType}
            onChange={handleChange}
          >
            <option value="">Select cover type</option>
            <option value="Single">Single</option>
            <option value="Couple">Couple</option>
            <option value="Family">Family</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="applicant1Age">
            Applicant 1 age
          </label>

          <input
            id="applicant1Age"
            name="applicant1Age"
            type="number"
            min="18"
            max="100"
            placeholder="18–100"
            value={formData.applicant1Age}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="applicant1History">
            Applicant 1 hospital cover history
          </label>

          <select
            id="applicant1History"
            name="applicant1History"
            value={formData.applicant1History}
            onChange={handleChange}
          >
            <option value="">Select history</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Not sure">Not sure</option>
          </select>
        </div>

        {(formData.coverType === "Couple" ||
          formData.coverType === "Family") && (
          <>
            <div className="form-group">
              <label htmlFor="applicant2Age">
                Applicant 2 age
              </label>

              <input
                id="applicant2Age"
                name="applicant2Age"
                type="number"
                min="18"
                max="100"
                placeholder="18–100"
                value={formData.applicant2Age}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="applicant2History">
                Applicant 2 hospital cover history
              </label>

              <select
                id="applicant2History"
                name="applicant2History"
                value={formData.applicant2History}
                onChange={handleChange}
              >
                <option value="">Select history</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not sure">Not sure</option>
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="hospitalCover">
            Hospital cover
          </label>

          <select
            id="hospitalCover"
            name="hospitalCover"
            value={formData.hospitalCover}
            onChange={handleChange}
          >
            <option value="">Select hospital cover</option>
            <option value="None">None</option>
            <option value="Basic">Basic — $90/month</option>
            <option value="Bronze">
              Bronze — $120/month
            </option>
            <option value="Silver">
              Silver — $160/month
            </option>
            <option value="Gold">Gold — $220/month</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="extrasCover">
            Extras cover
          </label>

          <select
            id="extrasCover"
            name="extrasCover"
            value={formData.extrasCover}
            onChange={handleChange}
          >
            <option value="">Select extras cover</option>
            <option value="None">None</option>
            <option value="Basic">Basic — $25/month</option>
            <option value="Standard">
              Standard — $45/month
            </option>
            <option value="Premium">
              Premium — $70/month
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="paymentFrequency">
            Payment frequency
          </label>

          <select
            id="paymentFrequency"
            name="paymentFrequency"
            value={formData.paymentFrequency}
            onChange={handleChange}
          >
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="annualDiscount">
            Annual-payment discount (%)
          </label>

          <input
            id="annualDiscount"
            name="annualDiscount"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={formData.annualDiscount}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">
          Notes (optional)
        </label>

        <textarea
          id="notes"
          name="notes"
          rows="4"
          placeholder="Optional notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <button
        className="primary-button"
        type="submit"
      >
        Calculate Quote
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {quoteResult && (
        <section className="quote-result">
          <h2>Quote Summary</h2>

          <div className="result-grid">
            <div>
              <span>Hospital premium</span>
              <strong>
                $
                {quoteResult.hospitalTotal.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>Extras premium</span>
              <strong>
                $
                {quoteResult.extrasTotal.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>Family upgrade fee</span>
              <strong>
                $
                {quoteResult.familyFee.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>Applicant 1 LHC loading</span>
              <strong>
                {(
                  quoteResult.applicant1Loading * 100
                ).toFixed(1)}
                %
              </strong>
            </div>

            {(formData.coverType === "Couple" ||
              formData.coverType === "Family") && (
              <div>
                <span>Applicant 2 LHC loading</span>
                <strong>
                  {(
                    quoteResult.applicant2Loading * 100
                  ).toFixed(1)}
                  %
                </strong>
              </div>
            )}

            <div>
              <span>Monthly premium</span>
              <strong>
                $
                {quoteResult.monthlyPremium.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>Yearly before discount</span>
              <strong>
                $
                {quoteResult.yearlyBeforeDiscount.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>Annual discount</span>
              <strong>
                {quoteResult.discountPercentage.toFixed(1)}
                %
              </strong>
            </div>

            <div>
              <span>Discount amount</span>
              <strong>
                $
                {quoteResult.discountAmount.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>Yearly after discount</span>
              <strong>
                $
                {quoteResult.yearlyAfterDiscount.toFixed(2)}
              </strong>
            </div>
          </div>

          <div className="quote-explanation">
            <h3>How your quote was calculated</h3>

            <p>
              Hospital and extras cover are calculated
              separately. Lifetime Health Cover loading is
              applied only to hospital cover based on each
              applicant's age and hospital cover history.
            </p>

            <p>
              Extras cover is not affected by Lifetime Health
              Cover loading.
            </p>

            {quoteResult.familyFee > 0 && (
              <p>
                A $30 monthly Family upgrade fee has been
                added.
              </p>
            )}

            {formData.paymentFrequency === "Yearly" ? (
              <p>
                Your{" "}
                {quoteResult.discountPercentage.toFixed(1)}
                % annual-payment discount has been applied
                to the yearly premium.
              </p>
            ) : (
              <p>
                Because you selected Monthly payment, no
                annual-payment discount has been applied.
              </p>
            )}

            <p>
              Lifetime Health Cover loading applies only to
              hospital cover. It does not apply to extras
              cover.
            </p>
          </div>

          {quoteResult.warnings &&
            quoteResult.warnings.length > 0 && (
              <div className="quote-warnings">
                <h3>Warnings</h3>

                {quoteResult.warnings.map(
                  (warning, index) => (
                    <p key={index}>{warning}</p>
                  )
                )}
              </div>
            )}
        </section>
      )}
    </form>
  </main>
</div>

);
}

export default App;
