document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form");
  const finalValue = document.querySelector("#final-value");
  const valueContainer = document.querySelector("#value-container");

  form.addEventListener("submit", function convertCurrency(event) {
    event.preventDefault();
    const amountInput = document.querySelector("#amount-input").value;
    const currency = document.querySelector("#currency").value;
    fetch(`https://api.nbp.pl/api/exchangerates/rates/a/${currency}/today/`)
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
          alert("error");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
});
