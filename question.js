const questions = [
    {
        text: "Seorang teknisi listrik sedang melakukan pengujian pada sebuah rangkaian sederhana yang terdiri dari sebuah resistor tunggal dan sebuah sumber tegangan. Sumber tegangan memberikan arus sebesar 2 Ampere melalui resistor dengan nilai hambatan 10 Ohm. Setelah beberapa waktu, teknisi tersebut mengubah nilai hambatan menjadi 20 Ohm, namun dengan menggunakan sumber tegangan yang sama. Berdasarkan hukum Ohm, bagaimana perubahan yang akan terjadi pada arus listrik yang mengalir setelah nilai hambatan diubah?",
        answers: [
            "Arus tetap 2 Ampere.",
            "Arus meningkat menjadi 4 Ampere.",
            "Arus menurun menjadi 1 Ampere.",
            "Arus meningkat menjadi 8 Ampere."
        ]
    },
    {
        text: "Apabila sebuah rangkaian paralel terdiri dari dua buah resistor masing-masing 5 Ohm dan 10 Ohm, berapakah besar hambatan total rangkaian?",
        answers: [
            "3.33 Ohm",
            "7.5 Ohm",
            "15 Ohm",
            "5 Ohm"
        ]
    },
    {
        text: "Jika sebuah kawat penghantar dengan panjang 2 meter dan luas penampang 0.1 mm² digunakan untuk mengalirkan arus sebesar 5 A, berapakah hambatan kawat tersebut jika resistivitas kawat 1.68 x 10^-8 Ohm m?",
        answers: [
            "0.336 Ohm",
            "0.168 Ohm",
            "0.672 Ohm",
            "0.84 Ohm"
        ]
    },
    {
        text: "Apa yang terjadi pada arus jika tegangan dinaikkan namun hambatan tetap?",
        answers: [
            "Arus naik",
            "Arus turun",
            "Tidak ada perubahan",
            "Arus nol"
        ]
    },
    {
        text: "Pada rangkaian seri, jika salah satu komponen rusak, apa yang terjadi?",
        answers: [
            "Rangkaian tetap bekerja",
            "Rangkaian berhenti bekerja",
            "Arus tetap mengalir",
            "Tegangan tetap"
        ]
    }
];

let currentQuestion = 0;
let progressIncrement = 100 / questions.length;
let isAnswered = false; // To track if the question has been answered

function loadQuestion(index) {
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const questionNumber = document.getElementById('question-number');
    const progressBar = document.getElementById('progress');

    questionText.innerHTML = `<p>${questions[index].text}</p>`;
    
    answersContainer.innerHTML = '';
    questions[index].answers.forEach((answer, i) => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="radio" name="answer" value="${i}"> ${answer}`;
        answersContainer.appendChild(label);
    });

    questionNumber.textContent = `${index + 1} / 5`;

    // Reset 'isAnswered' flag for new question
    isAnswered = false;

    // Event listener for answer labels
    const labels = document.querySelectorAll('.answers label'); 
    labels.forEach(label => {
        label.addEventListener('click', function() {
            // Reset styles of all labels before applying new styles
            labels.forEach(lbl => {
                lbl.style.backgroundColor = 'white';
                lbl.style.borderColor = '#EAEAEA';
            });
            this.style.backgroundColor = '#f5f5f5';
            this.style.borderColor = '#4C2670';

            if (!isAnswered) { // Only update progress if not yet answered
                // Update progress bar only once when an option is selected
                const progress = (currentQuestion + 1) * progressIncrement;
                progressBar.style.width = `${progress}%`;

                isAnswered = true; // Mark the question as answered
            }
        });
    });
}

// Event listener for the "Next" button
document.getElementById('next-button').addEventListener('click', () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion(currentQuestion);
    }
});

// Initial state: progress bar at 0%
document.getElementById('progress').style.width = '0%';

// Load the first question on page load
loadQuestion(currentQuestion);
