const HOSPITAL_PREMIUMS = {
None: 0,
Basic: 90,
Bronze: 120,
Silver: 160,
Gold: 220,
};

const EXTRAS_PREMIUMS = {
None: 0,
Basic: 25,
Standard: 45,
Premium: 70,
};

const FAMILY_UPGRADE_FEE = 30;

function calculateLHCLoading(age, history, hospitalCover) {
const numericAge = Number(age);

// No hospital cover means there is no LHC loading.
if (hospitalCover === "None") {
return 0;
}

// Previous hospital cover means no LHC loading.
if (history === "Yes") {
return 0;
}

// Unknown history means no loading is applied.
if (history === "Not sure") {
return 0;
}

// No previous cover and age 30 or younger means 0%.
if (history === "No" && numericAge <= 30) {
return 0;
}

// No previous cover and over 30:
// (age - 30) × 2%
if (history === "No" && numericAge > 30) {
return (numericAge - 30) * 0.02;
}

return 0;
}

function calculatePremium(formData) {
const hospitalPrice =
HOSPITAL_PREMIUMS[formData.hospitalCover] || 0;

const extrasPrice =
EXTRAS_PREMIUMS[formData.extrasCover] || 0;

let adultCount = 1;

if (
formData.coverType === "Couple" ||
formData.coverType === "Family"
) {
adultCount = 2;
}

// Applicant 1 LHC loading.
const applicant1Loading = calculateLHCLoading(
formData.applicant1Age,
formData.applicant1History,
formData.hospitalCover
);

// Applicant 2 LHC loading.
let applicant2Loading = 0;

if (adultCount === 2) {
applicant2Loading = calculateLHCLoading(
formData.applicant2Age,
formData.applicant2History,
formData.hospitalCover
);
}

// LHC loading applies only to hospital cover.
const applicant1HospitalPremium =
hospitalPrice * (1 + applicant1Loading);

let applicant2HospitalPremium = 0;

if (adultCount === 2) {
applicant2HospitalPremium =
hospitalPrice * (1 + applicant2Loading);
}

const hospitalTotal =
applicant1HospitalPremium +
applicant2HospitalPremium;

// Extras cover is not affected by LHC.
const extrasTotal =
extrasPrice * adultCount;

// Family has a $30 monthly upgrade fee.
const familyFee =
formData.coverType === "Family"
? FAMILY_UPGRADE_FEE
: 0;

// Total monthly premium.
const monthlyPremium =
hospitalTotal +
extrasTotal +
familyFee;

// Yearly premium before discount.
const yearlyBeforeDiscount =
monthlyPremium * 12;

// Discount applies only to yearly payment.
const discountPercentage =
formData.paymentFrequency === "Yearly"
? Number(formData.annualDiscount) || 0
: 0;

const discountAmount =
yearlyBeforeDiscount *
(discountPercentage / 100);

const yearlyAfterDiscount =
yearlyBeforeDiscount - discountAmount;

// Warnings.
const warnings = [];

if (formData.applicant1History === "Not sure") {
warnings.push(
"Applicant 1: Cover history is unknown — LHC loading has not been applied. This quote may be inaccurate."
);
}

if (
adultCount === 2 &&
formData.applicant2History === "Not sure"
) {
warnings.push(
"Applicant 2: Cover history is unknown — LHC loading has not been applied. This quote may be inaccurate."
);
}

return {
hospitalPrice,
extrasPrice,
adultCount,

applicant1Loading,
applicant2Loading,

applicant1HospitalPremium,
applicant2HospitalPremium,

hospitalTotal,
extrasTotal,
familyFee,

monthlyPremium,
yearlyBeforeDiscount,

discountPercentage,
discountAmount,
yearlyAfterDiscount,

warnings,

lhcStatement:
  "Lifetime Health Cover loading applies only to hospital cover. It does not apply to extras cover.",

};
}

export { calculatePremium };
