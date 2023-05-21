"use strict";

const steps = document.querySelectorAll(".main__modal");
const stepNumbers = document.querySelectorAll(".header__steps__step");
const btnsContainer = document.querySelector(".main__buttons");
const nextBtn = document.querySelector(".main__buttons__next");
const prevBtn = document.querySelector(".main__buttons__previous");
const confirmBtn = document.querySelector(".main__buttons__confirm");
const form = document.querySelector(".main__modal__one__form");
const inputs = document.querySelectorAll(".main__modal__one__input");
const inputName = document.querySelector(".input__name");
const inputEmail = document.querySelector(".input__email");
const inputPhone = document.querySelector(".input__phone");
const options = document.querySelectorAll(".main__modal__two__option");
const slider = document.querySelector(".slider");
const monthly = document.querySelector(".main__modal__two__monthly");
const yearly = document.querySelector(".main__modal__two__yearly");
const checkbox = document.querySelector(".checkbox");
const bonuses = document.querySelectorAll(".main__modal__two__option__bonus");
const addons = document.querySelectorAll(".main__modal__three__addon");
const lastStep = document.querySelector(".main__modal__four");
let lastStepPlan = lastStep.querySelector(".main__modal__four__top__header");
let lastStepPrice = lastStep.querySelector(".main__modal__four__top__price");
const lastStepTop = document.querySelector(".main__modal__four__top");
const lastStepBottom = document.querySelector(".main__modal__four__bottom");
const changeBtn = document.querySelector(".main__modal__four__top__changeBtn");

// Saving step choices
let plan = {};
let arrAddons = [];
let monthlyOrYearly;

// Set slider to monthly at start
if (checkbox.checked === true) checkbox.checked = false;

// Helper functions
const getPrice = (el, stepNumber, stepName) => {
  let priceEl = el.querySelector(
    `.main__modal__${stepNumber}__${stepName}__price`
  );
  let price = priceEl.textContent;
  return parseInt(price.split("/")[0].replace("$", ""));
};

const setBonusText = () => {
  if (checkbox.checked === false) {
    bonuses.forEach((bonus) => bonus.classList.remove("hidden"));
  }

  if (checkbox.checked === true) {
    bonuses.forEach((bonus) => bonus.classList.add("hidden"));
  }
};

const changeSetPrice = (el, priceNum, stepNumber, stepName) => {
  checkbox.checked ? (priceNum /= 10) : (priceNum *= 10);

  let priceEl = el.querySelector(
    `.main__modal__${stepNumber}__${stepName}__price`
  );
  let price = "$" + priceNum + (checkbox.checked ? "/mo" : "/yr");
  priceEl.textContent = price;
};

const checkMonthlyOrYearly = () => {
  monthlyOrYearly = document
    .querySelector(".switch__active")
    .textContent.trim();
};

// Email validation
const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

let step = 0;

// Step 1, check form inputs

// Switching between steps
// Clicking on next button
const nextStep = () => {
  if (step === 0) {
    let stop = validateForm();
    if (stop) return;
  }

  if (step === 1) {
    if (!checkForOption()) return;
    checkMonthlyOrYearly();
    getDataOption();
  }

  if (step === 2) {
    nextBtn.classList.add("hidden");
    confirmBtn.classList.remove("hidden");
    confirmBtn.addEventListener("click", finalStep);
    lastStepBottom.innerHTML = "";
    getDataForAddons();
    showLastStep();
    showTotalPrice();
  }

  stepNumbers[step].classList.remove("step__active");
  stepNumbers[step + 1].classList.add("step__active");
  steps[step].classList.add("hidden");
  steps[step + 1].classList.remove("hidden");
  prevBtn.classList.remove("hidden");
  step++;
};

// Clicking on previous button
const prevStep = () => {
  if (step === 1) prevBtn.classList.add("hidden");

  if (confirmBtn) {
    confirmBtn.classList.add("hidden");
    nextBtn.classList.remove("hidden");
  }

  if (step === 3) {
    // Remove selected addons for step 4, in order to not duplicate showing them
    lastStepBottom.innerHTML = "";
  }

  stepNumbers[step].classList.remove("step__active");
  stepNumbers[step - 1].classList.add("step__active");
  steps[step].classList.add("hidden");
  steps[step - 1].classList.remove("hidden");
  step--;
};

const finalStep = () => {
  steps[step].classList.add("hidden");
  steps[step + 1].classList.remove("hidden");
  btnsContainer.style.display = "none";
};

// Step 1, form validation
const validateForm = () => {
  let stop = false;
  // Check if fields are empty
  inputs.forEach((input) => {
    if (input.value === "") {
      stop = true;
      let errorMessage = input
        .closest(".main__modal__one__form__part")
        .querySelector(".errorMessage");
      errorMessage.innerText = `This field is required`;
      errorMessage.classList.remove("hidden");

      setTimeout(() => {
        errorMessage.classList.add("hidden");
      }, 3000);
    }
  });

  if (!validateEmail(inputEmail.value) && inputEmail.value !== "") {
    let errorMessage = inputEmail
      .closest(".main__modal__one__form__part")
      .querySelector(".errorMessage");
    errorMessage.innerText = `Not a valid email address`;
    errorMessage.classList.remove("hidden");
    stop = true;

    setTimeout(() => {
      errorMessage.classList.add("hidden");
    }, 3000);
  }

  return stop;
};

// Step 2, selecting option
const selectOptions = (e) => {
  let option = e.target.closest(".main__modal__two__option");

  options.forEach((option) => {
    if (option.classList.contains("option__active"))
      option.classList.remove("option__active");
  });

  option.classList.add("option__active");
};

// Step 2, getting data
const getDataOption = () => {
  let option = document.querySelector(".option__active");
  let name = option.querySelector(
    ".main__modal__two__option__header"
  ).textContent;
  let price = option.querySelector(
    ".main__modal__two__option__price"
  ).textContent;

  plan.name = name;
  plan.price = price;
};

// Step 2, checking if option is selected
const checkForOption = () => {
  let result = false;

  options.forEach((option) => {
    if (option.classList.contains("option__active")) {
      result = true;
    }
  });

  if (result === false) {
    let errorMessage = document.querySelector(
      ".main__modal__two__errorMessage"
    );
    errorMessage.innerText = `Please select one of the options below.`;
    errorMessage.classList.remove("hidden");

    setTimeout(() => {
      errorMessage.classList.add("hidden");
    }, 3000);
  }

  return result;
};

// Step 2, toggle between monthly and yearly
const toggleBillingOptions = () => {
  monthly.classList.toggle("switch__active");
  yearly.classList.toggle("switch__active");

  // Change prices for step 2
  options.forEach((option) => {
    // Get price for options
    let priceNum = getPrice(option, "two", "option");

    // Set bonus text
    setBonusText();

    // Change and set price depending on choice
    changeSetPrice(option, priceNum, "two", "option");
  });
};

// Step 3, selecting addons
const selectAddons = (e) => {
  let addon = e.target.closest(".main__modal__three__addon");
  if (addon.classList.contains("addon__active")) {
    addon.classList.remove("addon__active");
    return;
  }

  addon.classList.add("addon__active");
};

// Step 3, getting data for addons
const getDataForAddons = () => {
  arrAddons = [];

  let selectedAddons = document.querySelectorAll(".addon__active");

  if (!selectedAddons) return;

  selectedAddons.forEach((addon) => {
    let data = {};
    const name = addon
      .querySelector(".main__modal__three__addon__header")
      .textContent.trim();
    const price = addon.querySelector(
      ".main__modal__three__addon__price"
    ).textContent;

    data.name = name;
    data.price = price;
    arrAddons.push(data);
  });
};

// Step 3, monthly or yearly
const toggleBillingAddons = () => {
  addons.forEach((addon) => {
    // Get price for addons
    let priceNum = getPrice(addon, "three", "addon");
    // Change and set price depending on choice
    changeSetPrice(addon, priceNum, "three", "addon");
  });
};

// Step 4, showing choices and prices
const showLastStep = () => {
  lastStepPlan.textContent = `${plan.name} (${monthlyOrYearly})`;
  lastStepPrice.textContent = plan.price;
  4;

  if (arrAddons.length === 0 && document.querySelector(".line__separator"))
    document.querySelector(".line__separator").remove();
  if (arrAddons.length === 0) return;

  // If there are selected addons
  // 1) Add line separator
  if (!document.querySelector(".line__separator")) {
    let lineSep = document.createElement("div");
    lineSep.classList.add("line__separator");
    lastStepTop.insertAdjacentElement("afterend", lineSep);
  }

  // 2) Add addons
  arrAddons.forEach((addon) => {
    let html = `
    <div class="flex">
      <h2 class="main__modal__four__bottom__header">
        ${addon.name}
      </h2>
      <p class="main__modal__four__bottom__price">${addon.price}</p>
    </div>
    `;

    if (lastStepBottom.children.length !== 0) {
      lastStepBottom.children[
        lastStepBottom.children.length - 1
      ].insertAdjacentHTML("afterend", html);
      return;
    }

    lastStepBottom.insertAdjacentHTML("afterbegin", html);
  });
};

const showTotalPrice = () => {
  const totalHeaderEl = document.querySelector(
    ".main__modal__four__total__header"
  );
  const totalPriceEl = document.querySelector(
    ".main__modal__four__total__price"
  );
  let totalPrice = 0;

  // Change total price based on selected plan
  totalHeaderEl.textContent = `Total (per ${monthlyOrYearly
    .slice(0, -2)
    .toLowerCase()})`;

  totalPrice += parseInt(
    lastStepPrice.textContent.split("/")[0].replace("$", "")
  );
  totalPriceEl.textContent = `$${totalPrice}/${
    monthlyOrYearly === "Monthly" ? "mo" : "yr"
  }`;

  if (lastStepBottom.children.length === 0) return;

  // If there are selected addons, change total price
  let lastStepAddonsPrices = lastStepBottom.querySelectorAll(
    ".main__modal__four__bottom__price"
  );
  lastStepAddonsPrices.forEach((price) => {
    totalPrice += parseInt(price.textContent.split("/")[0].replace("$", ""));
  });
  totalPriceEl.textContent = `$${totalPrice}/${
    monthlyOrYearly === "Monthly" ? "mo" : "yr"
  }`;
};

// Clicking on change btn
const changeSelections = () => {
  stepNumbers[step].classList.remove("step__active");
  stepNumbers[step - 2].classList.add("step__active");
  steps[step].classList.add("hidden");
  steps[step - 2].classList.remove("hidden");
  step -= 2;

  confirmBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");
};

nextBtn.addEventListener("click", nextStep);
prevBtn.addEventListener("click", prevStep);
options.forEach((option) => option.addEventListener("click", selectOptions));
addons.forEach((addon) => addon.addEventListener("click", selectAddons));
slider.addEventListener("click", toggleBillingOptions);
slider.addEventListener("click", toggleBillingAddons);
changeBtn.addEventListener("click", changeSelections);
