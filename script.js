"use strict";

//Кнопка "Рассчитать"
const startButton = document.getElementById("start");
//Кнопка "Сбросить"
const resetButton = document.getElementById("cancel");
//Месячный доход
const amountSalary = document.querySelector(".salary-amount");
//Дополнительный доход
let incomeItems = document.querySelectorAll(".income-items");
const incomeTitle = document.querySelector("input.income-title"),
  incomeAmount = document.querySelector(".income-amount"),
  incomeAddButton = document.getElementsByTagName("button")[0];
//Возможный доход
const additionalIncome = document.querySelectorAll(".additional_income-item");
//Обязательные расходы
let expensesItems = document.querySelectorAll(".expenses-items");
const expensesTitle = document.querySelector("input.expenses-title"),
  expensesAmount = document.querySelector(".expenses-amount"),
  expensesAddButton = document.querySelectorAll("button")[1];
//Возможные рассходы
const additionalExpenses = document.querySelector(".additional_expenses-item");
//Депозит
const depositCheckButton = document.querySelector("#deposit-check"),
  depositBank = document.querySelector(".deposit-bank"),
  depositAmount = document.querySelector(".deposit-amount"),
  depositPercent = document.querySelector(".deposit-percent");
//Цель
const targetAmount = document.querySelector(".target-amount");
//Период расчёта
const period = document.querySelector(".period-select"),
  periodAmount = document.querySelector(".period-amount");

const budgetMonthValue =
    document.getElementsByClassName("budget_month-value")[0],
  budgetDayValue = document.getElementsByClassName("budget_day-value")[0],
  expensesMonthValue = document.getElementsByClassName(
    "expenses_month-value"
  )[0],
  additionalIncomeValue = document.getElementsByClassName(
    "additional_income-value"
  )[0],
  additionalExpensesValue = document.getElementsByClassName(
    "additional_expenses-value"
  )[0],
  incomePeriodValue = document.getElementsByClassName("income_period-value")[0],
  targetMonthValue = document.getElementsByClassName("target_month-value")[0];

class AppData {
  constructor() {
    this.income = {};
    this.addIncome = [];
    this.incomeMonth = 0;
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    this.userData = {};
    this.storageData = {};
    this.cookieData = {};
    this.memory = [
      'budgetDayValue',
      'expensesMonthValue',
      'additionalExpensesValue',
      'additionalIncomeValue',
      'budgetMonthValue',
      'targetMonthValue',
      'incomePeriodValue',
      'period',
      'periodAmount',
      'disabledInputs'
    ];
  }
  init() {
    this.getAllCookie();
    this.getStorage();
    this.getUserData();
  }
  getUserData() {
    const checkEmptyObject = (obj) => {
      for (let key in obj) {
        return true;
      }
      return false;
    };
    if (checkEmptyObject(this.storageData) && checkEmptyObject(this.cookieData)) {
      if(this.memory.every(item => this.storageData.item === this.cookieData.item)) {
          this.userData = JSON.parse(localStorage.getItem("userData"));
      }
      this.inputUserData();
    } else {
      this.clearCookie();
      this.clearStorage();
    }
  }
  inputUserData() {
    budgetDayValue.value = this.userData.budgetDayValue;
    expensesMonthValue.value = this.userData.expensesMonthValue;
    additionalExpensesValue.value = this.userData.additionalExpensesValue;
    additionalIncomeValue.value = this.userData.additionalIncomeValue;
    budgetMonthValue.value = this.userData.budgetMonthValue;
    targetMonthValue.value = this.userData.targetMonthValue;
    incomePeriodValue.value = this.userData.incomePeriodValue;
    period.value = this.userData.period;
    periodAmount.textContent = this.userData.periodAmount;
    this.budgetMonth = budgetMonthValue.value;
    period.addEventListener("input", () => {
      incomePeriodValue.value = this.calcSavedMoney();
    });
    if (this.userData.disabledInputs === 'true') {
      this.disabledInputs('.data input[type="text"]', true);
      this.disabledInputs("#deposit-check", true);
      this.disabledInputs(".income_add", true);
      this.disabledInputs(".expenses_add", true);
      this.disabledInputs(".deposit-bank", true);
      startButton.style.display = "none";
      resetButton.style.display = "inline-block";
    } else {
      this.disabledInputs('.data input[type="text"]', false);
      this.disabledInputs("#deposit-check", false);
      this.disabledInputs(".income_add", false);
      this.disabledInputs(".expenses_add", false);
      this.disabledInputs(".deposit-bank", false);
      startButton.style.display = "";
      resetButton.style.display = "none";
    }
  }
  start() {
    this.budget = parseFloat(amountSalary.value);
    this.getExpenses();
    this.getIncome();
    this.getInfoDeposit();
    this.getBudget();
    this.getExpensesMonth();
    this.getAddExpenses();
    this.getAddIncome();
    this.showResults();

    this.disabledInputs('.data input[type="text"]', true);
    this.disabledInputs("#deposit-check", true);
    this.disabledInputs(".income_add", true);
    this.disabledInputs(".expenses_add", true);
    this.disabledInputs(".deposit-bank", true);
    this.storageData.disabledInputs = "true";
    this.setCookie("disabledInputs", "true", 86400e3*365);

    startButton.style.display = "none";
    resetButton.style.display = "inline-block";

    this.setStorage("userData", this.storageData);
    this.setAllCookie();
  }
  reset() {
    startButton.disabled = true;

    this.income = {};
    this.addIncome = [];
    this.incomeMonth = 0;
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;

    amountSalary.value = "";
    this.resetIncome();
    this.resetIncomeBlock();
    this.resetAddIncome();
    this.resetExpenses();
    this.resetExpensesBlock();
    additionalExpenses.value = "";
    targetAmount.value = "";
    period.value = 1;
    periodAmount.textContent = "1";

    budgetMonthValue.value = "";
    budgetDayValue.value = "";
    expensesMonthValue.value = "";
    additionalIncomeValue.value = "";
    additionalExpensesValue.value = "";
    incomePeriodValue.value = "";
    targetMonthValue.value = "";
    depositCheckButton.checked = false;
    depositBank.style.display = "none";
    depositBank.value = "";
    depositAmount.style.display = "none";
    depositAmount.value = "";
    depositPercent.style.display = "none";
    depositPercent.value = "";

    this.disabledInputs('.data input[type="text"]', false);
    this.disabledInputs("#deposit-check", false);
    this.disabledInputs(".income_add", false);
    this.disabledInputs(".expenses_add", false);
    this.disabledInputs(".deposit-bank", false);
    this.disabledInputs(false);

    startButton.style.display = "";
    resetButton.style.display = "none";

    this.clearStorage();
  }
  disabledInputs(selector, value) {
    let inputs = document.querySelectorAll(selector);
    inputs.forEach((item) => {item.disabled = value;});
  }
  addExpensesBlock() {
    let expensesItemClone = expensesItems[0].cloneNode(true);
    expensesItemClone.querySelector(".expenses-title").value = "";
    expensesItemClone.querySelector(".expenses-amount").value = "";
    expensesItems[0].parentNode.insertBefore(
      expensesItemClone,
      expensesAddButton
    );
    expensesItems = document.querySelectorAll(".expenses-items");
    if (expensesItems.length === 3) {
      expensesAddButton.style.display = "none";
    }
  }
  resetExpensesBlock() {
    expensesItems = document.querySelectorAll(".expenses-items");
    expensesItems.forEach((item, index) => {
      if (expensesItems.length > 1 && index !== 0) {
        item.remove();
      }
    });
    expensesItems = document.querySelectorAll(".expenses-items");
    if (expensesItems.length === 1) {
      expensesAddButton.style.display = "";
    }
  }
  getExpenses() {
    expensesItems.forEach((item) => {
      let expensesTitle = item.querySelector(".expenses-title").value,
        expensesAmount = item.querySelector(".expenses-amount").value;
      if (expensesTitle.trim() && expensesAmount) {
        this.expenses[expensesTitle] = parseFloat(expensesAmount);
      }
    });
    return this.expenses;
  }
  resetExpenses() {
    expensesItems = document.querySelectorAll(".expenses-items");
    expensesItems.forEach((item) => {
      let expensesTitle = item.querySelector(".expenses-title");
      expensesTitle.value = "";
      let expensesAmount = item.querySelector(".expenses-amount");
      expensesAmount.value = "";
    });
  }
  getAddExpenses() {
    let addExpenses = additionalExpenses.value.toLowerCase().split(",");
    addExpenses.forEach((item) => {
      item = item.trim();
      if (item) {
        this.addExpenses.push(item);
      }
    });
  }
  addIncomeBlock() {
    let incomeItemClone = incomeItems[0].cloneNode(true);
    incomeItemClone.querySelector(".income-title").value = "";
    incomeItemClone.querySelector(".income-amount").value = "";
    incomeItems[0].parentNode.insertBefore(incomeItemClone, incomeAddButton);
    incomeItems = document.querySelectorAll(".income-items");
    if (incomeItems.length === 3) {
      incomeAddButton.style.display = "none";
    }
  }
  resetIncomeBlock() {
    incomeItems = document.querySelectorAll(".income-items");
    incomeItems.forEach((item, index) => {
      if (incomeItems.length > 1 && index !== 0) {
        item.remove();
      }
    });
    incomeItems = document.querySelectorAll(".income-items");
    if (incomeItems.length === 1) {
      incomeAddButton.style.display = "";
    }
  }
  getIncome() {
    incomeItems = document.querySelectorAll(".income-items");
    incomeItems.forEach((item) => {
      let incomeTitle = item.querySelector(".income-title").value,
        incomeAmount = item.querySelector(".income-amount").value;
      if (incomeTitle && incomeAmount) {
        this.income[incomeTitle] = parseFloat(incomeAmount);
        this.incomeMonth += parseFloat(this.income[incomeTitle]);
      }
    });
  }
  resetIncome() {
    incomeItems = document.querySelectorAll(".income-items");
    incomeItems.forEach((item) => {
      let incomeTitle = item.querySelector(".income-title");
      incomeTitle.value = "";
      let incomeAmount = item.querySelector(".income-amount");
      incomeAmount.value = "";
    });
  }
  getAddIncome() {
    additionalIncome.forEach((item) => {
      item = item.value.trim();
      if (item) {
        this.addIncome.push(item);
      }
    });
  }
  resetAddIncome() {
    additionalIncome.forEach((item) => {
      item.value = "";
    });
  }
  getExpensesMonth() {
    let sum = 0;
    for (let key in this.expenses) {
      sum += this.expenses[key];
    }
    this.expensesMonth = sum;
    return this.expensesMonth;
  }
  getBudget() {
    const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
    this.budgetMonth = this.budget + this.incomeMonth + monthDeposit - this.getExpensesMonth();
    this.budgetDay = this.budgetMonth / 30;
  }
  getTargetMonth() {
    let result = targetAmount.value / this.budgetMonth;
    if (targetAmount.value) {
      return result;
    } else {
      return 0;
    }
  }
  depositHandler() {
    if (depositCheckButton.checked) {
      depositBank.style.display = "inline-block";
      depositAmount.style.display = "inline-block";
      this.deposit = true;
      depositBank.addEventListener("change", this.changePercent);
    } else {
      depositBank.style.display = "none";
      depositBank.value = "";
      depositAmount.style.display = "none";
      depositAmount.value = "";
      this.deposit = false;
      depositPercent.style.display = "none";
      depositPercent.value = "";

      depositBank.removeEventListener("change", this.changePercent);
    }
  }
  getInfoDeposit() {
    if (this.deposit) {
      this.percentDeposit = depositPercent.value;
      this.moneyDeposit = depositAmount.value;
    }
  }
  changePercent() {
    const valueSelect = this.value;
    if (valueSelect === "other") {
      depositPercent.style.display = "inline-block";
      depositPercent.value = "";
      depositPercent.addEventListener("change", () => {
        if (
          depositPercent.value < 0 ||
          depositPercent.value > 100 ||
          isNaN(parseFloat(depositPercent.value))
        ) {
          alert('Введите корректное значение в поле проценты');
          depositPercent.value = "";
          startButton.disabled = true;
        }
      });
    } else {
      depositPercent.value = valueSelect;
      depositPercent.style.display = "none";
    }
  }
  calcSavedMoney() {
    return this.budgetMonth * period.value;
  }
  showResults() {
    budgetDayValue.value = Math.round(this.budgetDay);
    this.storageData.budgetDayValue = budgetDayValue.value;

    expensesMonthValue.value = this.expensesMonth;
    this.storageData.expensesMonthValue = expensesMonthValue.value;

    additionalExpensesValue.value = this.addExpenses.join(", ");
    this.storageData.additionalExpensesValue = additionalExpensesValue.value;

    additionalIncomeValue.value = this.addIncome.join(", ");
    this.storageData.additionalIncomeValue = additionalIncomeValue.value;

    budgetMonthValue.value = this.budgetMonth;
    this.storageData.budgetMonthValue = budgetMonthValue.value;

    targetMonthValue.value = Math.ceil(this.getTargetMonth());
    this.storageData.targetMonthValue = targetMonthValue.value;

    incomePeriodValue.value = this.calcSavedMoney();
    this.storageData.incomePeriodValue = incomePeriodValue.value;

    this.storageData.period = period.value ? period.value : 1;
    this.storageData.periodAmount = periodAmount.textContent ? periodAmount.textContent : 1;


    period.addEventListener("input", () => {
      incomePeriodValue.value = this.calcSavedMoney();
    });
  }
  eventsListeners(item, action, callback) {
    item.addEventListener(action, callback);
  }
  checkName(items) {
    items.forEach((item) => {
      let checkExp = /^[0-9A-Za-z]+$/;
      item.addEventListener("input", () => {
        if (!checkExp.test(item)) {
          item.value = item.value.replace(checkExp, "");
        }
      });
    });
  }
  checkAmount(items) {
    items.forEach((item) => {
      let checkExp = /^[а-яА-ЯA-Za-z, ]+$/;
      item.addEventListener("input", () => {
        if (!checkExp.test(item)) {
          item.value = item.value.replace(checkExp, "");
        }
      });
    });
  }
  setAttributeDisabled() {
    startButton.disabled = true;
    amountSalary.addEventListener("change", () => {
      if (amountSalary.value) {
        if (!depositCheckButton.checked) {
          startButton.disabled = false;
        }
      } else {
        startButton.disabled = true;
      }
    });
  }
  setStorage(name, data) {
    localStorage.setItem( name, JSON.stringify(data));
  }
  getStorage() {
    const checkEmptyStorage = (obj) => {
      for (let key in obj) {
        return true;
      }
      return false;
    };
    if (localStorage.getItem("userData") && checkEmptyStorage(JSON.parse(localStorage.getItem("userData")))) {
      this.storageData = JSON.parse(localStorage.getItem("userData"));
    }
  }
  clearStorage() {
    localStorage.removeItem('userData');
    this.storageData = {};
  }
  setCookie(key, value, maxAge, path, domain, secure) {
    let cookieStr = `${encodeURI(key)}=${encodeURI(value)}`;

    if (maxAge) {
      let expires = new Date(Date.now() + maxAge);
      // 1 day: 86400e3 
      cookieStr += `; expires=${expires.toGMTString()}`;
    }

    cookieStr += path ? `; path=${encodeURI(path)}` : '';
    cookieStr += domain ? `; domain=${encodeURI(domain)}` : '';
    cookieStr += secure ? `; secure=${encodeURI(secure)}` : '';

    document.cookie = cookieStr;
  }
  setAllCookie() {
    this.setCookie("budgetDayValue", budgetDayValue.value, 86400e3*365);
    this.setCookie("expensesMonthValue", expensesMonthValue.value, 86400e3*365);
    this.setCookie("additionalExpensesValue", additionalExpensesValue.value, 86400e3*365);
    this.setCookie("additionalIncomeValue", additionalIncomeValue.value, 86400e3*365);
    this.setCookie("budgetMonthValue", budgetMonthValue.value, 86400e3*365);
    this.setCookie("targetMonthValue", targetMonthValue.value, 86400e3*365);
    this.setCookie("incomePeriodValue", incomePeriodValue.value, 86400e3*365);
    this.setCookie("period", period.value, 86400e3*365);
    this.setCookie("periodAmount", periodAmount.textContent, 86400e3*365);
  }
  getAllCookie() {
    if ( this.memory.every(item => this.checkCookie(item))) {
      this.cookieData.budgetDayValue = this.getCookie("budgetDayValue");
      this.cookieData.expensesMonthValue = this.getCookie("expensesMonthValue");
      this.cookieData.additionalExpensesValue = this.getCookie("additionalExpensesValue");
      this.cookieData.additionalIncomeValue = this.getCookie("additionalIncomeValue");
      this.cookieData.budgetMonthValue = this.getCookie("budgetMonthValue");
      this.cookieData.targetMonthValue = this.getCookie("targetMonthValue");
      this.cookieData.incomePeriodValue = this.getCookie("incomePeriodValue");
      this.cookieData.period = this.getCookie("period");
      this.cookieData.periodAmount = this.getCookie("periodAmount");
      this.cookieData.disabledInputs = this.getCookie('disabledInputs');
    }
    this.checkCookie();
  }
  clearCookie() {
    this.setCookie("budgetDayValue", budgetDayValue.value, -1);
    this.setCookie("expensesMonthValue", expensesMonthValue.value, -1);
    this.setCookie("additionalExpensesValue", additionalExpensesValue.value, -1);
    this.setCookie("additionalIncomeValue", additionalIncomeValue.value, -1);
    this.setCookie("budgetMonthValue", budgetMonthValue.value, -1);
    this.setCookie("targetMonthValue", targetMonthValue.value, -1);
    this.setCookie("incomePeriodValue", incomePeriodValue.value, -1);
    this.setCookie("period", period.value, -1);
    this.setCookie("periodAmount", periodAmount.textContent, -1);
    this.setCookie("disabledInputs", "false", -1);
    this.cookieData = {};
  }
  getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURI(matches[1]) : undefined;
  }
  checkCookie(name) {
    let regExp = new RegExp(`${name}(?=\=)`);
    return document.cookie.split('; ').some(item => regExp.test(item));
  }
}

const appData = new AppData();
appData.init();

appData.setAttributeDisabled();
appData.eventsListeners(startButton, "click", appData.start.bind(appData));
appData.eventsListeners(resetButton, "click", appData.reset.bind(appData));
appData.eventsListeners(expensesAddButton, "click", appData.addExpensesBlock);
appData.eventsListeners(period, "input", () => {
  periodAmount.textContent = period.value;
});
appData.eventsListeners(incomeAddButton, "click", appData.addIncomeBlock);
appData.eventsListeners(
  depositCheckButton,
  "change",
  appData.depositHandler.bind(appData)
);
appData.eventsListeners(depositCheckButton, "change", () => {
  if (depositCheckButton.checked && amountSalary.value) {
    startButton.disabled = true;
    depositAmount.addEventListener("change", () => {
      if (depositAmount.value && depositPercent.value && amountSalary.value) {
        startButton.disabled = false;
      } else {
        startButton.disabled = true;
      }
    });
    depositPercent.addEventListener("change", () => {
      if (depositAmount.value && depositPercent.value && amountSalary.value) {
        startButton.disabled = false;
      } else {
        startButton.disabled = true;
      }
    });
    depositBank.addEventListener("change", () => {
      if (depositAmount.value && depositPercent.value && amountSalary.value) {
        startButton.disabled = false;
      } else {
        startButton.disabled = true;
      }
    });
  } else if (depositCheckButton.checked && !amountSalary.value) {
    startButton.disabled = true;
  } else if (!depositCheckButton.checked && !amountSalary.value) {
    startButton.disabled = true;
  } else if (!depositCheckButton.checked && amountSalary.value) {
    startButton.disabled = false;
  }
});

const nameItems = document.querySelectorAll('[placeholder="Наименование"]'),
  amountItems = document.querySelectorAll('[placeholder="Сумма"]');

appData.checkName(nameItems);
appData.checkAmount(amountItems);