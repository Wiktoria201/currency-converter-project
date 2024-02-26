document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form");
  const finalValue = document.querySelector("#final-value");
  const valueContainer = document.querySelector("#value-container");
  const currencySelect = document.querySelector("#currency");
  let errorMessage = null;

  function showErrorMessage() {
    if (!errorMessage) {
      const errorMessageContent =
        "Failed to fetch currency data. Please try again later.";
      errorMessage = document.createElement("p");
      errorMessage.textContent = errorMessageContent;
      errorMessage.classList.add("error");
      errorMessage.style.display = "block";
      form.appendChild(errorMessage);
    }
    return errorMessage;
  }

  fetch("https://api.nbp.pl/api/exchangerates/tables/a/")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const currencies = data[0].rates;
      currencies.forEach((currency) => {
        const option = document.createElement("option");
        option.value = currency.code;
        option.textContent = currency.currency;
        currencySelect.appendChild(option);
      });
    })
    .catch(() => {
      showErrorMessage();
    });

  form.addEventListener("submit", function convertCurrency(event) {
    event.preventDefault();
    const amountInput = event.target.amount.value;
    const currency = event.target.currency.value;
    fetch(`https://api.nbp.pl/api/exchangerates/rates/a/${currency}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const rate = data?.rates?.[0]?.mid;
        if (rate) {
          finalValue.textContent =
            "To " + (amountInput * rate).toFixed(2) + " złotych";
          valueContainer.style.display = "block";

          const errorMessage = form.querySelector(".error");
          if (errorMessage) {
            form.removeChild(errorMessage);
          }
        } else {
          showErrorMessage();
        }
      })
      .catch(() => {
        showErrorMessage();
      });
  });
});
