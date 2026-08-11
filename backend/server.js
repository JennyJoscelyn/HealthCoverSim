import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const VALID_COVER_TYPES = ["Single", "Couple", "Family"];
const VALID_HOSPITAL_COVERS = ["None", "Basic", "Bronze", "Silver", "Gold"];
const VALID_EXTRAS_COVERS = ["None", "Basic", "Standard", "Premium"];
const VALID_PAYMENT_FREQUENCIES = ["Monthly", "Yearly"];
const VALID_HISTORY = ["Yes", "No", "Not sure"];

function validateQuote(data) {
  const {
    customerName,
    coverType,
    applicant1Age,
    applicant1History,
    applicant2Age,
    applicant2History,
    hospitalCover,
    extrasCover,
    paymentFrequency,
    annualDiscount,
  } = data;

  if (!customerName || !customerName.trim()) {
    return "Customer name is required.";
  }

  if (!VALID_COVER_TYPES.includes(coverType)) {
    return "Invalid cover type.";
  }

  if (
    applicant1Age === undefined ||
    applicant1Age === null ||
    Number(applicant1Age) < 18 ||
    Number(applicant1Age) > 100
  ) {
    return "Applicant 1 age must be between 18 and 100.";
  }

  if (!VALID_HISTORY.includes(applicant1History)) {
    return "Invalid Applicant 1 hospital cover history.";
  }

  if (coverType === "Couple" || coverType === "Family") {
    if (
      applicant2Age === undefined ||
      applicant2Age === null ||
      Number(applicant2Age) < 18 ||
      Number(applicant2Age) > 100
    ) {
      return "Applicant 2 age must be between 18 and 100.";
    }

    if (!VALID_HISTORY.includes(applicant2History)) {
      return "Invalid Applicant 2 hospital cover history.";
    }
  }

  if (!VALID_HOSPITAL_COVERS.includes(hospitalCover)) {
    return "Invalid hospital cover.";
  }

  if (!VALID_EXTRAS_COVERS.includes(extrasCover)) {
    return "Invalid extras cover.";
  }

  if (!VALID_PAYMENT_FREQUENCIES.includes(paymentFrequency)) {
    return "Invalid payment frequency.";
  }

  if (
    annualDiscount === undefined ||
    annualDiscount === null ||
    Number(annualDiscount) < 0 ||
    Number(annualDiscount) > 10
  ) {
    return "Annual discount must be between 0% and 10%.";
  }

  return null;
}

/*
  GET /
  Test that the backend is running.
*/
app.get("/", (req, res) => {
  res.json({
    message: "HealthCoverSim backend is running",
  });
});

/*
  GET /api/quotes
  Return all saved quotes.
*/
app.get("/api/quotes", (req, res) => {
  try {
    const quotes = db
      .prepare("SELECT * FROM quotes ORDER BY created_at DESC")
      .all();

    res.json(quotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to retrieve quotes.",
    });
  }
});

/*
  GET /api/quotes/:id
  Return one quote.
*/
app.get("/api/quotes/:id", (req, res) => {
  try {
    const quote = db
      .prepare("SELECT * FROM quotes WHERE id = ?")
      .get(req.params.id);

    if (!quote) {
      return res.status(404).json({
        error: "Quote not found.",
      });
    }

    res.json(quote);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to retrieve quote.",
    });
  }
});

/*
  POST /api/quotes
  Create and save a new quote.
*/
app.post("/api/quotes", (req, res) => {
  try {
    const validationError = validateQuote(req.body);

    if (validationError) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const {
      customerName,
      coverType,
      applicant1Age,
      applicant1History,
      applicant2Age,
      applicant2History,
      hospitalCover,
      extrasCover,
      paymentFrequency,
      annualDiscount,
      notes,
    } = req.body;

    const statement = db.prepare(`
      INSERT INTO quotes (
        customer_name,
        cover_type,
        applicant1_age,
        applicant1_cover_history,
        applicant2_age,
        applicant2_cover_history,
        hospital_cover,
        extras_cover,
        payment_frequency,
        annual_discount,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = statement.run(
      customerName.trim(),
      coverType,
      Number(applicant1Age),
      applicant1History,
      coverType === "Single" ? null : Number(applicant2Age),
      coverType === "Single" ? null : applicant2History,
      hospitalCover,
      extrasCover,
      paymentFrequency,
      Number(annualDiscount),
      notes || null
    );

    const newQuote = db
      .prepare("SELECT * FROM quotes WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json({
      message: "Quote created successfully.",
      quote: newQuote,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to create quote.",
    });
  }
});

/*
  PUT /api/quotes/:id
  Update an existing quote.
*/
app.put("/api/quotes/:id", (req, res) => {
  try {
    const validationError = validateQuote(req.body);

    if (validationError) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const existingQuote = db
      .prepare("SELECT * FROM quotes WHERE id = ?")
      .get(req.params.id);

    if (!existingQuote) {
      return res.status(404).json({
        error: "Quote not found.",
      });
    }

    const {
      customerName,
      coverType,
      applicant1Age,
      applicant1History,
      applicant2Age,
      applicant2History,
      hospitalCover,
      extrasCover,
      paymentFrequency,
      annualDiscount,
      notes,
    } = req.body;

    db.prepare(`
      UPDATE quotes
      SET
        customer_name = ?,
        cover_type = ?,
        applicant1_age = ?,
        applicant1_cover_history = ?,
        applicant2_age = ?,
        applicant2_cover_history = ?,
        hospital_cover = ?,
        extras_cover = ?,
        payment_frequency = ?,
        annual_discount = ?,
        notes = ?
      WHERE id = ?
    `).run(
      customerName.trim(),
      coverType,
      Number(applicant1Age),
      applicant1History,
      coverType === "Single" ? null : Number(applicant2Age),
      coverType === "Single" ? null : applicant2History,
      hospitalCover,
      extrasCover,
      paymentFrequency,
      Number(annualDiscount),
      notes || null,
      req.params.id
    );

    const updatedQuote = db
      .prepare("SELECT * FROM quotes WHERE id = ?")
      .get(req.params.id);

    res.json({
      message: "Quote updated successfully.",
      quote: updatedQuote,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to update quote.",
    });
  }
});

/*
  DELETE /api/quotes/:id
  Delete a quote.
*/
app.delete("/api/quotes/:id", (req, res) => {
  try {
    const existingQuote = db
      .prepare("SELECT * FROM quotes WHERE id = ?")
      .get(req.params.id);

    if (!existingQuote) {
      return res.status(404).json({
        error: "Quote not found.",
      });
    }

    db.prepare("DELETE FROM quotes WHERE id = ?").run(req.params.id);

    res.json({
      message: "Quote deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to delete quote.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`HealthCoverSim backend running on http://localhost:${PORT}`);
});