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

const firebaseConfig = {
    apiKey: "AIzaSyAYVlAQPYeibEjk9XL1jTTwYhOX5MfwttI",
    authDomain: "ohmsimulation.firebaseapp.com",
    projectId: "ohmsimulation",
    storageBucket: "ohmsimulation.appspot.com",
    messagingSenderId: "62744511537",
    appId: "1:62744511537:web:337a3b3268fb90e9918110",
    measurementId: "G-G816LW6GVL"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore(); 

document.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            document.getElementById("profileName").textContent = user.displayName || "Guest";

            firestore.collection("users").doc(user.uid).get().then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    const profilePic = userData.profilePicture || "profile-pic.png";
                    document.getElementById("profile-picture").src = profilePic;
                } else {
                    document.getElementById("profile-picture").src = "profile-pic.png";
                }
            }).catch(error => {
                console.error("Error fetching user profile:", error);
                document.getElementById("profile-picture").src = "profile-pic.png";
            });
        } else {
            window.location.href = "login.html";
        }
    });
});

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
    const iScale = Math.min(1 + current / 100, 2);
    iElement.style.transform = `scale(${1 + current / 100})`;
    rElement.style.transform = `scale(${1 + resistance / 1000})`;

    const arrowScale = Math.min(1 + current / 100, 2);
    leftArrowElement.style.transform = `scale(${arrowScale}) rotate(90deg)`;
    rightArrowElement.style.transform = `scale(${arrowScale})`;

    updateBatteries(voltage);
    updateDots(resistance);
}

const maxDots = 200;

function createDots() {
    const resistorBox = document.querySelector('.resistor-box');
    resistorBox.innerHTML = '';

    for (let i = 0; i < maxDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.top = `${Math.random() * 38}px`;
        dot.style.left = `${Math.random() * 300}px`;
        resistorBox.appendChild(dot);
    }
}

function updateDots(resistance) {
    const dots = document.querySelectorAll('.dot');
    const visibleDots = Math.floor((resistance / 1000) * maxDots);

    dots.forEach((dot, index) => {
        if (index < visibleDots) {
            dot.style.opacity = 1;
        } else {
            dot.style.opacity = 0;
        }
    });
}

createDots();

function calculateCurrent(voltage, resistance) {
    return (voltage / resistance) * 1000;
}

function updateBatteries(voltage) {
    batteriesContainer.innerHTML = '';
    const batteryCount = Math.floor(voltage / 1.5);
    const remainingVoltage = voltage % 1.5;

    for (let i = 0; i < batteryCount; i++) {
        const battery = document.createElement('div');
        battery.className = 'battery';
        battery.textContent = `${1.5}V`;
        batteriesContainer.appendChild(battery);
    }

    if (remainingVoltage > 0) {
        const partialBattery = document.createElement('div');
        partialBattery.className = 'battery';
        partialBattery.textContent = `${remainingVoltage.toFixed(1)}V`;
        batteriesContainer.appendChild(partialBattery);
    }
}

voltageSlider.addEventListener('input', updateValues);
resistanceSlider.addEventListener('input', updateValues);

updateValues();

document.querySelector('.next-button').addEventListener('click', function() {
    alert('Next question logic will be implemented');
});