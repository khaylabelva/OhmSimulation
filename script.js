const voltageSlider = document.getElementById('voltage');
const resistanceSlider = document.getElementById('resistance');
const voltageValue = document.getElementById('voltage-value');
const resistanceValue = document.getElementById('resistance-value');
const currentDisplay = document.getElementById('current');
const vElement = document.getElementById('v');
const iElement = document.getElementById('i');
const rElement = document.getElementById('r');
const batteriesContainer = document.getElementById('batteries');

// Reference both arrows
const leftArrowElement = document.querySelector('.left-arrow');
const rightArrowElement = document.querySelector('.right-arrow');

// Update displayed values and animation
function updateValues() {
    const voltage = parseFloat(voltageSlider.value);
    const resistance = parseFloat(resistanceSlider.value);
    const current = calculateCurrent(voltage, resistance);

    voltageValue.textContent = `${voltage.toFixed(1)}V`;
    resistanceValue.textContent = `${resistance}Ω`;
    currentDisplay.textContent = `Current = ${current.toFixed(2)} mA`;

    // Update font sizes for V, I, R based on voltage
    vElement.style.transform = `scale(${1 + voltage / 10})`;
    iElement.style.transform = `scale(${1 + current / 100})`;
    rElement.style.transform = `scale(${1 + resistance / 1000})`;

    // Update arrow size based on current
    const arrowScale = 1 + current / 100;
    leftArrowElement.style.transform = `scale(${arrowScale}) rotate(90deg)`; // Left arrow flipped
    rightArrowElement.style.transform = `scale(${arrowScale})`;

    // Update number of batteries based on voltage
    updateBatteries(voltage);
}

// Calculate current using Ohm's law (I = V / R)
function calculateCurrent(voltage, resistance) {
    return (voltage / resistance) * 1000; // Convert A to mA
}

// Update battery display based on voltage
function updateBatteries(voltage) {
    batteriesContainer.innerHTML = ''; // Clear existing batteries
    const batteryCount = Math.floor(voltage / 1.5); // Calculate number of 1.5V batteries
    for (let i = 0; i < batteryCount; i++) {
        const battery = document.createElement('div');
        battery.className = 'battery';
        battery.textContent = '1.5V';
        batteriesContainer.appendChild(battery); // Add battery to container
    }
}

// Event listeners for sliders
voltageSlider.addEventListener('input', updateValues);
resistanceSlider.addEventListener('input', updateValues);

// Initial update
updateValues();

document.querySelector('.next-button').addEventListener('click', function() {
    // Logic for moving to the next question can go here
    alert('Next question logic will be implemented');
});