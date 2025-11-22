// 1. SELECT ELEMENTS
const form = document.getElementById('age-calculator-form');

// Inputs
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');

// Outputs
const yearsOutput = document.getElementById('years');
const monthsOutput = document.getElementById('months');
const daysOutput = document.getElementById('days');

// 2. MAIN EVENT LISTENER
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Stop page reload

  // Run validation
  const isValid = validateInputs();

  // If valid, run calculation
  if (isValid) {
    const d = parseInt(dayInput.value);
    const m = parseInt(monthInput.value);
    const y = parseInt(yearInput.value);
    calculateAge(d, m, y);
  }
});

// 3. VALIDATION FUNCTION
function validateInputs() {
  let isFormValid = true;
  const currentYear = new Date().getFullYear();

  // Helper to read values
  const d = parseInt(dayInput.value);
  const m = parseInt(monthInput.value);
  const y = parseInt(yearInput.value);

  // Reset all errors first
  resetError(dayInput);
  resetError(monthInput);
  resetError(yearInput);

  // --- CHECK 1: EMPTY FIELDS ---
  if (!dayInput.value) {
    setError(dayInput, "This field is required");
    isFormValid = false;
  }
  if (!monthInput.value) {
    setError(monthInput, "This field is required");
    isFormValid = false;
  }
  if (!yearInput.value) {
    setError(yearInput, "This field is required");
    isFormValid = false;
  }

  // If any field is empty, stop here (don't validate numbers yet)
  if (!isFormValid) return false;

  // --- CHECK 2: VALID RANGES ---
  // Check Day (1-31)
  if (d < 1 || d > 31) {
    setError(dayInput, "Must be a valid day");
    isFormValid = false;
  }
  // Check Month (1-12)
  if (m < 1 || m > 12) {
    setError(monthInput, "Must be a valid month");
    isFormValid = false;
  }
  // Check Year (Past)
  if (y > currentYear) {
    setError(yearInput, "Must be in the past");
    isFormValid = false;
  }

  // If ranges are wrong, stop here
  if (!isFormValid) return false;

  // --- CHECK 3: VALID DATE LOGIC (e.g., Feb 30) ---
  // Create a date object. JS counts months 0-11, so we do (m - 1)
  const testDate = new Date(y, m - 1, d);

  // If the month of the resulting date is NOT the month we put in,
  // it means the day was too high (e.g. April 31 rolled over to May 1)
  if (testDate.getMonth() !== m - 1) {
    setError(dayInput, "Must be a valid date");
    isFormValid = false;
  }

  return isFormValid;
}

// 4. CALCULATION FUNCTION
function calculateAge(day, month, year) {
  const today = new Date();
  let currentDay = today.getDate();
  let currentMonth = today.getMonth() + 1; // Convert 0-11 to 1-12
  let currentYear = today.getFullYear();

  let valYears = currentYear - year;
  let valMonths = currentMonth - month;
  let valDays = currentDay - day;

  // Logic: If days are negative, borrow from previous month
  if (valDays < 0) {
    valMonths--; 
    // Get days in the previous month
    // (Month - 1) gets us previous month, '0' gets the last day of it
    const daysInLastMonth = new Date(currentYear, currentMonth - 1, 0).getDate();
    valDays += daysInLastMonth;
  }

  // Logic: If months are negative, borrow from previous year
  if (valMonths < 0) {
    valYears--;
    valMonths += 12;
  }

  // Update DOM
  yearsOutput.textContent = valYears;
  monthsOutput.textContent = valMonths;
  daysOutput.textContent = valDays;
}

// 5. ERROR STYLING HELPERS
function setError(inputElement, message) {
  const parent = inputElement.parentElement;
  const errorElement = parent.querySelector('.error-msg');
  
  parent.classList.add('error');
  errorElement.innerText = message;
}

function resetError(inputElement) {
  const parent = inputElement.parentElement;
  const errorElement = parent.querySelector('.error-msg');
  
  parent.classList.remove('error');
  errorElement.innerText = "";
}