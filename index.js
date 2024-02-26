document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form");
  const finalValue = document.querySelector("#final-value");
  const valueContainer = document.querySelector("#value-container");
  const currencySelect = document.querySelector("#currency");

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
    .catch((error) => {
      console.error(error);
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
        } else {
          alert("Mamy problem z przeliczeniem kwoty, spróbuj później");
        }
      })
      .catch((error) => {
        // alert("Mamy problem z przeliczeniem kwoty, spróbuj później");
        // console.error(error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent =
          "Wystąpił problem z przeliczeniem kwoty. Spróbuj ponownie później.";
        errorMessage.classList.add("red");
        valueContainer.appendChild(errorMessage);

        console.error(error);
      });
  });
});
