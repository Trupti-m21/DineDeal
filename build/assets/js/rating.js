let slider = document.getElementById("range");
let value = document.querySelector(".value");
value.innerHTML = slider.value; // Display the default slider value

function calcValue() {
  valuePercentage = (slider.value / slider.max)*100;
    slider.style.background = `linear-gradient(to right, #f59d31 ${valuePercentage}%, #ebe9e7 ${valuePercentage}%)`;
}

// Update the current slider value (each time you drag the slider handle)
slider.addEventListener('input', function(){
  calcValue();
  value.textContent = this.value; 
})

calcValue();