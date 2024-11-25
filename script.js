const radios = document.getElementsByName("mortgage-type");
const numberInputs = document.querySelectorAll('input[type="number"]')
const labelDiv = document.querySelector(".label-div")

radios.forEach(radio => {
    radio.addEventListener("click", (event) => {


        radios.forEach(r => {
            const label = document.querySelector(`label[for="${r.id}"]`);
            label.classList.remove("selected");
        });

        if (radio.checked) {
            const selectedLabel = document.querySelector(`label[for="${radio.id}"]`);
            selectedLabel.classList.add("selected")
        }

    })
});

document.querySelector(".calculate").addEventListener("click", (event) => {
    event.preventDefault();
    let isValid = true;

    numberInputs.forEach(input => {
        if (input.value === "") {
            isValid = false;
            changeSpan();
            window.addEventListener("resize", changeSpan)

            input.closest("label").querySelector(".error").style.display = "block"
            input.closest("label").querySelector("div").classList.add("error-label");
        } else {
            input.closest("label").querySelector(".error").style.display = "none";
            input.closest("label").querySelector("div").classList.remove("error-label");


        }
    });


    let isRadioSelected = Array.from(radios).some(radio => radio.checked);
    if (!isRadioSelected) {
        isValid = false;
        radios[0].closest("fieldset").querySelector(".error").style.display = "block";
    } else {
        radios[0].closest("fieldset").querySelector(".error").style.display = "none";

    };


    const amount = parseFloat(document.getElementById("amount").value);
    const term = parseInt(document.getElementById("term").value);
    const rate = parseFloat(document.getElementById("rate").value) / 100; // Convert percentage to decimal
    const mortgageType = document.querySelector('input[name="mortgage-type"]:checked').value;

    // take the spans
    const monthlyPaymentSpan = document.querySelector(".monthly-amount-span")
    const totalPaymentSpan = document.querySelector(".total-repayment-span")

    // get the cart filled and empty states
    const emptyCart = document.querySelector(".results-empty")
    const filledCart = document.querySelector(".results-filled")

    console.log(emptyCart, filledCart)

    let monthlyPayment = 0;
    let totalRepayment = 0;

    if (isValid) {
        const monthlyRate = rate / 12; // Monthly interest rate
        const n = term * 12; // Total number of payments

        if (mortgageType === "repayment") {
            if (monthlyRate > 0) { // Prevent division by zero
                monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
            } else {
                monthlyPayment = amount / n; // If interest rate is zero
            }
            totalRepayment = monthlyPayment * n;
        } else if (mortgageType === "interest-only") {
            monthlyPayment = amount * monthlyRate; // Interest-only payment
            totalRepayment = (monthlyPayment * term * 12) + amount; // Total repayment includes principal
        }

        const formattedMonthlyPayment = monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedTotalRepayment = totalRepayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        console.log(formattedMonthlyPayment, formattedTotalRepayment);

        // update the html

        monthlyPaymentSpan.innerHTML = `&#163; ${formattedMonthlyPayment}`;
        totalPaymentSpan.innerHTML = `&#163; ${formattedTotalRepayment}`;

        // change the cart state to the filled state
        emptyCart.style.display = "none";
        console.log(window.screen.width < 520)
        if (window.screen.width < 700) {
            filledCart.style.display = "grid"
        } else {
            filledCart.style.display = "flex";
        }


    } else {
        filledCart.style.display = "none";
        if (window.screen.width < 700) {
            emptyCart.style.display = "grid"
        } else {
            emptyCart.style.display = "flex";
        }

    }
});


// clear button
const clearBtn = document.querySelector(".clear-all");

clearBtn.addEventListener("click", (event) => {
    event.preventDefault();
    // make all the value empty
    numberInputs.forEach(input => {
        input.value = ""
    });

    // uncheck the radios
    radios.forEach(radio => {
        radio.checked = false;
        // remove the "selected" class from the label of the radio buttons
        const labels = document.querySelectorAll(`label[for=${radio.id}]`)
        labels.forEach(label => label.classList.remove("selected"))
    });
})

function changeSpan() {
    numberInputs.forEach(input => {
        if (input.className === "details-input") {
            document.querySelectorAll(".details-input").forEach(i => {
                if (window.screen.width > 700) {
                    i.parentElement.parentElement.style.placeSelf = "start";
                    i.style.width = "50%"

                } else {
                    i.parentElement.parentElement.style.removeProperty("place-self");
                    i.style.width = "100px"

                }
            });
        }
    })
}
changeSpan()
window.addEventListener('resize', changeSpan)
