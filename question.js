function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');

    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

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
            const profileName = document.getElementById("profileName");
            profileName.textContent = user.displayName || "Guest";

            firestore.collection("users").doc(user.uid).get()
                .then(doc => {
                    if (doc.exists) {
                        const userData = doc.data();
                        const profilePic = userData.profilePicture || "profile-pic.png";
                        document.getElementById("profile-picture").src = profilePic;
                    } else {
                        document.getElementById("profile-picture").src = "profile-pic.png";
                    }
                })
                .catch(error => {
                    console.error("Error fetching user profile:", error);
                    document.getElementById("profile-picture").src = "profile-pic.png";
                });

            firestore.collection("users").doc(user.uid).collection("practiceQuestions")
                .doc("progress")
                .get()
                .then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        currentQuestion = data.currentQuestion || 0;
                        selectedAnswers = data.selectedAnswers || {};
                        document.getElementById('progress').style.width = data.progress || '0%';
                        if (currentQuestion === 4 && typeof selectedAnswers[currentQuestion+1] !== "undefined" ) {
                            loadQuestion(5);
                        } else {
                            loadQuestion(currentQuestion);
                        }
                        
                    }
                })
                .catch(error => {
                    console.error("Error fetching state:", error);
                    loadQuestion(currentQuestion);
                });
        } else {
            window.location.href = "login.html";
        }
    });
});

const questions = [
    {
        text: "Dalam sebuah eksperimen, sebuah resistor dengan hambatan variabel terhubung ke sumber tegangan konstan. Ketika hambatan awal adalah 5 Ohm, arus yang mengalir melalui resistor adalah 3 Ampere. Ketika hambatan ditingkatkan menjadi 15 Ohm, bagaimana perubahan daya disipasi dalam resistor sesuai hukum Ohm?",
        answers: [
            "Daya disipasi tetap sama.",
            "Daya disipasi meningkat tiga kali lipat.",
            "Daya disipasi berkurang menjadi sepertiga.",
            "Daya disipasi berkurang menjadi sepersembilan."
        ],
        correctAnswer: 3
    },
    {
        text: "Dua resistor, R1 = 4 Ohm dan R2 = 12 Ohm, disusun dalam seri dan dihubungkan ke baterai 24 Volt. Jika R1 mengalami kenaikan suhu yang membuat nilai resistansinya meningkat menjadi 6 Ohm, berapakah besar arus yang mengalir setelah perubahan resistansi?",
        answers: [
            "1.5 A",
            "2 A",
            "3 A",
            "4 A"
        ],
        correctAnswer: 0
    },
    {
        text: "Dalam rangkaian yang terdiri dari sebuah resistor tetap dan sebuah resistor variabel (potensiometer), tegangan pada resistor tetap diukur 5 Volt ketika nilai potensiometer 10 Ohm. Jika potensiometer dinaikkan menjadi 20 Ohm dan sumber tegangan tetap 15 Volt, berapakah besar tegangan pada resistor tetap?",
        answers: [
            "Tetap 5 Volt",
            "Bertambah menjadi 10 Volt",
            "Berkurang menjadi 3.75 Volt",
            "Berkurang menjadi 2.5 Volt"
        ],
        correctAnswer: 2
    },
    {
        text: "Sebuah kabel penghantar panjang memiliki hambatan yang bergantung pada suhunya. Pada suhu kamar (25°C), hambatan kawat adalah 10 Ohm. Jika suhu kawat dinaikkan menjadi 100°C dengan koefisien suhu resistansi 0.004/°C, berapakah hambatan baru kawat tersebut?",
        answers: [
            "11 Ohm",
            "12 Ohm",
            "14 Ohm",
            "16 Ohm"
        ],
        correctAnswer: 1
    },
    {
        text: "Sebuah rangkaian terdiri dari tiga resistor dengan nilai R1 = 10 Ohm, R2 = 5 Ohm, dan R3 = 20 Ohm, disusun dalam konfigurasi campuran (seri dan paralel) dengan sumber tegangan 40 Volt. Jika R1 dan R2 dalam paralel dan gabungannya seri dengan R3, berapakah arus total yang mengalir melalui rangkaian?",
        answers: [
            "1 A",
            "2 A",
            "4 A",
            "0.5 A"
        ],
        correctAnswer: 0
    }
];

let currentQuestion = 0;
let progressIncrement = 100 / questions.length;
let isAnswered = false;
let selectedAnswers = {};

function updateNextButton() {
    const nextButton = document.getElementById('next-button');
    if (currentQuestion === questions.length - 1) {
        nextButton.textContent = 'Finish';
        nextButton.removeEventListener('click', nextQuestionHandler);
        nextButton.addEventListener('click', finishQuiz);
    } else {
        nextButton.textContent = 'Next';
        nextButton.removeEventListener('click', finishQuiz);
        nextButton.addEventListener('click', nextQuestionHandler);
    }
}

function loadQuestion(index) {
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const questionNumber = document.getElementById('question-number');
    const progressBar = document.getElementById('progress');
    const nextButton = document.getElementById('next-button');

    if (index === 4 && typeof selectedAnswers[index+1] !== "undefined" ) {
        finishQuiz();
        return;
    }

    nextButton.style.display = 'none';

    questionText.innerHTML = `<p>${questions[index].text}</p>`;
    answersContainer.innerHTML = '';

    questions[index].answers.forEach((answer, i) => {
        const label = document.createElement('label');
        const isChecked = selectedAnswers[index] === i ? 'checked' : '';
        label.innerHTML = `<input type="radio" name="answer" value="${i}" ${isChecked}> ${answer}`;
        answersContainer.appendChild(label);
    });

    questionNumber.textContent = `${index + 1} / ${questions.length}`;
    isAnswered = false;

    const labels = document.querySelectorAll('.answers label');
    const savedAnswer = selectedAnswers[index];
    const correctAnswerIndex = questions[index].correctAnswer;

    if (savedAnswer !== undefined) {
        labels.forEach(lbl => lbl.style.pointerEvents = 'none');
        labels[correctAnswerIndex].style.backgroundColor = '#e0ffe0';
        labels[correctAnswerIndex].style.borderColor = 'green';

        if (savedAnswer !== correctAnswerIndex) {
            labels[savedAnswer].style.backgroundColor = '#ffe0e0';
            labels[savedAnswer].style.borderColor = 'red';
        } else {
            labels[savedAnswer].style.backgroundColor = '#e0ffe0';
            labels[savedAnswer].style.borderColor = 'green';
        }

        nextButton.style.display = 'block';
    } else {
        labels.forEach((label, i) => {
            label.addEventListener('click', function () {
                if (!isAnswered) {
                    isAnswered = true;

                    labels.forEach(lbl => lbl.style.pointerEvents = 'none');

                    if (i === correctAnswerIndex) {
                        this.style.backgroundColor = '#e0ffe0';
                        this.style.borderColor = 'green';
                    } else {
                        this.style.backgroundColor = '#ffe0e0';
                        this.style.borderColor = 'red';
                        labels[correctAnswerIndex].style.backgroundColor = '#e0ffe0';
                        labels[correctAnswerIndex].style.borderColor = 'green';
                    }

                    selectedAnswers[index] = i;
                    progressBar.style.width = `${(currentQuestion + 1) * progressIncrement}%`;
                    saveStateToFirestore();

                    nextButton.style.display = 'block';

                    updateNextButton();
                }
            });
        });
    }
    updateNextButton();
}

function saveStateToFirestore() {
    const user = auth.currentUser;
    if (user) {
        firestore.collection("users").doc(user.uid).collection("practiceQuestions")
            .doc("progress")
            .set({
                currentQuestion,
                selectedAnswers,
                progress: document.getElementById('progress').style.width
            }, { merge: true })
            .then(() => {
                console.log("State saved successfully.");
            })
            .catch((error) => {
                console.error("Error saving state:", error);
            });
    }
}

document.getElementById('next-button').addEventListener('click', nextQuestionHandler());

function nextQuestionHandler() {
    if (currentQuestion < questions.length - 1) {
        if (selectedAnswers[currentQuestion] !== undefined) {
            currentQuestion++;
            saveStateToFirestore();
            loadQuestion(currentQuestion);
        }
    }
}

function finishQuiz() {
    selectedAnswers[currentQuestion+1] = 0
    saveStateToFirestore();
    const questionContainer = document.querySelector('.question-container');
    if (questionContainer) {
        questionContainer.style.display = 'none';
    }
    const finishPage = document.getElementById('finish-page');
    if (finishPage) {
        finishPage.style.display = 'block';
    }
}

document.getElementById('retake-button').addEventListener('click', retakeQuiz);
document.getElementById('score-button').addEventListener('click', viewScore);

function retakeQuiz() {
    currentQuestion = 0;
    selectedAnswers = {};
    document.getElementById('progress').style.width = '0%';

    const finishPage = document.getElementById('finish-page');
    const existingScoreDisplay = finishPage.querySelector('.score-display');
    if (existingScoreDisplay) {
        existingScoreDisplay.remove();
    }

    saveStateToFirestore();

    document.getElementById('finish-page').style.display = 'none';
    document.querySelector('.question-container').style.display = 'block';

    loadQuestion(currentQuestion);
}

function viewScore() {
    const finishPage = document.getElementById('finish-page');
    const existingScoreDisplay = finishPage.querySelector('.score-display');
    
    if (existingScoreDisplay) {
        existingScoreDisplay.remove();
    } else {
        let score = 0;
        questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                score += 1;
            }
        });

        const scoreMessage = `Your score: ${score} out of ${questions.length}`;
        const scoreDisplay = document.createElement('p');
        scoreDisplay.classList.add('score-display');
        scoreDisplay.textContent = scoreMessage;

        finishPage.appendChild(scoreDisplay);
    }
}

document.getElementById('progress').style.width = '0%';
loadQuestion(currentQuestion);