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

const writeButton = document.getElementById('write-button');
const historyModal = document.getElementById('history-modal');
const closeButton = document.querySelector('.close-button');
const historyButton = document.getElementById('history-button');
const historyList = document.getElementById('history-list');

writeButton.addEventListener('click', () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            const voltage = parseFloat(voltageSlider.value);
            const resistance = parseFloat(resistanceSlider.value);
            const current = calculateCurrent(voltage, resistance);
            const timestamp = new Date();

            const simulationArea = document.querySelector('.simulation-section');
            html2canvas(simulationArea).then(canvas => {
                const screenshotBase64 = canvas.toDataURL();

                firestore.collection("users").doc(user.uid).collection("simulationHistory").add({
                    voltage: voltage.toFixed(1),
                    resistance: resistance,
                    current: current.toFixed(2),
                    timestamp: timestamp,
                    screenshot: screenshotBase64
                }).then(() => {
                    alert("Simulation data saved successfully with screenshot!");
                }).catch(error => {
                    console.error("Error saving simulation data:", error);
                    alert("Failed to save simulation data. Try again later.");
                });
            });
        } else {
            alert("Please log in to save your simulation.");
        }
    });
});

historyButton.addEventListener('click', () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            firestore.collection("users").doc(user.uid).collection("simulationHistory")
                .orderBy("timestamp", "desc")
                .get()
                .then(querySnapshot => {
                    historyList.innerHTML = '';

                    const updateIndexes = () => {
                        const items = document.querySelectorAll('.history-item');
                        items.forEach((item, i) => {
                            item.querySelector('div').textContent = i + 1;
                        });
                    };

                    let index = 1;
                    querySnapshot.forEach(doc => {
                        const data = doc.data();
                        const listItem = document.createElement('div');
                        listItem.className = 'history-item';

                        listItem.innerHTML = `
                            <div>${index}</div>
                            <div>${data.voltage}V</div>
                            <div>${data.resistance}Ω</div>
                            <div>${data.current} mA</div>
                            <div>${data.timestamp.toDate().toLocaleString()}</div>
                        `;

                        const screenshotCell = document.createElement('div');
                        if (data.screenshot) {
                            const downloadLink = document.createElement('a');
                            downloadLink.href = data.screenshot;
                            downloadLink.download = `screenshot_${data.timestamp.toDate().toLocaleString()}.png`;
                            downloadLink.textContent = "Download";
                            screenshotCell.appendChild(downloadLink);
                        }
                        listItem.appendChild(screenshotCell);

                        const actionsCell = document.createElement('div');
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = "Delete";
                        deleteButton.classList.add('delete-button');

                        deleteButton.addEventListener('click', () => {
                            firestore.collection("users").doc(user.uid).collection("simulationHistory")
                                .doc(doc.id)
                                .delete()
                                .then(() => {
                                    alert("History item deleted successfully.");
                                    listItem.remove();
                                    updateIndexes();
                                }).catch(error => {
                                    console.error("Error deleting history item:", error);
                                    alert("Failed to delete history. Try again later.");
                                });
                        });

                        actionsCell.appendChild(deleteButton);
                        listItem.appendChild(actionsCell);

                        historyList.appendChild(listItem);
                        index++;
                    });
                    historyModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }).catch(error => {
                    console.error("Error retrieving history:", error);
                    alert("Failed to retrieve history. Try again later.");
                });
        } else {
            alert("Please log in to view your history.");
        }
    });
});

document.querySelector('.close-button').addEventListener('click', () => {
    historyModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

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