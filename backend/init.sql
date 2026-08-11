CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    cover_type TEXT NOT NULL,
    applicant1_age INTEGER NOT NULL,
    applicant1_cover_history TEXT NOT NULL,
    applicant2_age INTEGER,
    applicant2_cover_history TEXT,
    hospital_cover TEXT NOT NULL,
    extras_cover TEXT NOT NULL,
    payment_frequency TEXT NOT NULL,
    annual_discount REAL NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);