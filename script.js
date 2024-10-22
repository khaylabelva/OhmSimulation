const voltageSlider = document.getElementById('voltage');
const resistanceSlider = document.getElementById('resistance');
const voltageValue = document.getElementById('voltage-value');
const resistanceValue = document.getElementById('resistance-value');
const currentDisplay = document.getElementById('current');
const vElement = document.getElementById('v');
const iElement = document.getElementById('i');
const rElement = document.getElementById('r');
const batteriesContainer = document.getElementById('batteries');

const leftArrowElement = document.querySelector('.left-arrow');
const rightArrowElement = document.querySelector('.right-arrow');

function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');

    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

function updateValues() {
    const voltage = parseFloat(voltageSlider.value);
    const resistance = parseFloat(resistanceSlider.value);
    const current = calculateCurrent(voltage, resistance);

    voltageValue.textContent = `${voltage.toFixed(1)}V`;
    resistanceValue.textContent = `${resistance}Ω`;
    currentDisplay.textContent = `Current = ${current.toFixed(2)} mA`;

    vElement.style.transform = `scale(${1 + voltage / 10})`;
    iElement.style.transform = `scale(${1 + current / 100})`;
    rElement.style.transform = `scale(${1 + resistance / 1000})`;

    const arrowScale = 1 + current / 100;
    leftArrowElement.style.transform = `scale(${arrowScale}) rotate(90deg)`;
    rightArrowElement.style.transform = `scale(${arrowScale})`;

    updateBatteries(voltage);
}

function calculateCurrent(voltage, resistance) {
    return (voltage / resistance) * 1000;
}

function updateBatteries(voltage) {
    batteriesContainer.innerHTML = '';
    const batteryCount = Math.floor(voltage / 1.5);
    for (let i = 0; i < batteryCount; i++) {
        const battery = document.createElement('div');
        battery.className = 'battery';
        battery.textContent = '1.5V';
        batteriesContainer.appendChild(battery);
    }
}

voltageSlider.addEventListener('input', updateValues);
resistanceSlider.addEventListener('input', updateValues);

updateValues();

document.querySelector('.next-button').addEventListener('click', function() {
    alert('Next question logic will be implemented');
});