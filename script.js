"use strict";

const account1 = {
  owner: "Arun Sadhanala",
  movements: [8500, 15300, -2100, 35000, -8900, -1200, 4200, 25000],
  interestRate: 1.1,
  pin: 1111,

  movementsDates: [
    "2025-01-15T10:00:00.000Z",
    "2025-02-20T12:30:00.000Z",
    "2025-03-05T08:45:00.000Z",
    "2025-04-10T15:20:00.000Z",
    "2025-05-18T11:55:00.000Z",
    "2025-06-01T14:10:00.000Z",
    "2025-07-25T09:35:00.000Z",
    "2025-08-01T17:05:00.000Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account2 = {
  owner: "Priya Sharma",
  movements: [45000, 8000, -1500, -5600, -12000, 500, 10000, -250],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2025-01-22T13:45:00.000Z",
    "2025-03-10T16:00:00.000Z",
    "2025-04-01T07:30:00.000Z",
    "2025-05-05T19:15:00.000Z",
    "2025-06-12T10:50:00.000Z",
    "2025-07-03T11:20:00.000Z",
    "2025-08-15T14:40:00.000Z",
    "2025-09-01T06:05:00.000Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account3 = {
  owner: "Amit Patel",
  movements: [1200, 6500, -300, 1500, -420, -100, 9000, 50000],
  interestRate: 0.9,
  pin: 3333,

  movementsDates: [
    "2025-02-01T09:10:00.000Z",
    "2025-03-15T18:55:00.000Z",
    "2025-04-20T11:40:00.000Z",
    "2025-05-28T07:25:00.000Z",
    "2025-06-05T13:00:00.000Z",
    "2025-07-19T16:50:00.000Z",
    "2025-08-22T08:15:00.000Z",
    "2025-09-30T10:30:00.000Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account4 = {
  owner: "Deepika Rao",
  movements: [3000, -150, 25000, -800, -6000, 12000, -3500, 2000],
  interestRate: 1.3,
  pin: 4444,

  movementsDates: [
    "2025-01-10T14:05:00.000Z",
    "2025-02-05T17:35:00.000Z",
    "2025-03-25T09:50:00.000Z",
    "2025-04-08T12:15:00.000Z",
    "2025-05-15T15:40:00.000Z",
    "2025-06-28T18:25:00.000Z",
    "2025-07-07T06:45:00.000Z",
    "2025-08-19T11:00:00.000Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const accsContainer = document.querySelector(".accounts-container");
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Functions
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(date, new Date());

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates[i],
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? "deposit" : "withdrawal";

    // Create date for each movement
    const display = formatMovementDate(new Date(movementDate), acc.locale);

    const formattedMov = formatCurrency(movement, acc.locale, acc.currency);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${display}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcdisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter((deposit) => deposit > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};

createUserNames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcdisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  let time = 60 * 5;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(logOutTimer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    time--;
  };

  tick();
  const logOutTimer = setInterval(tick, 1000);
  return logOutTimer;
};

// Event Handlers
let currentAccount, timer;
accsContainer.classList.add("translate");

btnLogin.addEventListener("click", function (e) {
  // Prevents default reload when the form is submitted
  e.preventDefault();

  accsContainer.classList.remove("translate");

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    accsContainer.style.visibility = "hidden";
    containerApp.style.opacity = 1;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);

    // Call logout timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.userName !== currentAccount.userName
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());

    // Clear input fields
    inputTransferTo.value = inputTransferAmount.value = "";
    inputTransferTo.blur();
    inputTransferAmount.blur();

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= 0.1 * amount)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan approved date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    // Delete account
    const index = accounts.findIndex(
      (acc) => acc.userName === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    console.log(accounts);

    // Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";

    // Display accounts information
    setTimeout(() => {
      accsContainer.style.visibility = "visible";
      accsContainer.classList.add("translate");
    }, 800);
  }

  inputCloseUsername.value = inputClosePin.value = "";
  inputCloseUsername.blur();
  inputClosePin.blur();
});

let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
