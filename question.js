const questions = [
    {
        text: "Dalam sebuah eksperimen, sebuah resistor dengan hambatan variabel terhubung ke sumber tegangan konstan. Ketika hambatan awal adalah 5 Ohm, arus yang mengalir melalui resistor adalah 3 Ampere. Ketika hambatan ditingkatkan menjadi 15 Ohm, bagaimana perubahan daya disipasi dalam resistor sesuai hukum Ohm?",
        answers: [
            "Daya disipasi tetap sama.",
            "Daya disipasi meningkat tiga kali lipat.",
            "Daya disipasi berkurang menjadi sepertiga.",
            "Daya disipasi berkurang menjadi sepersembilan."
        ],
        correctAnswer: 3 // Jawaban benar nya "Daya disipasi berkurang menjadi sepersembilan."
    },
    {
        text: "Dua resistor, R1 = 4 Ohm dan R2 = 12 Ohm, disusun dalam seri dan dihubungkan ke baterai 24 Volt. Jika R1 mengalami kenaikan suhu yang membuat nilai resistansinya meningkat menjadi 6 Ohm, berapakah besar arus yang mengalir setelah perubahan resistansi?",
        answers: [
            "1.5 A",
            "2 A",
            "3 A",
            "4 A"
        ],
        correctAnswer: 0 // Jawaban benar nya "1.5 A"
    },
    {
        text: "Dalam rangkaian yang terdiri dari sebuah resistor tetap dan sebuah resistor variabel (potensiometer), tegangan pada resistor tetap diukur 5 Volt ketika nilai potensiometer 10 Ohm. Jika potensiometer dinaikkan menjadi 20 Ohm dan sumber tegangan tetap 15 Volt, berapakah besar tegangan pada resistor tetap?",
        answers: [
            "Tetap 5 Volt",
            "Bertambah menjadi 10 Volt",
            "Berkurang menjadi 3.75 Volt",
            "Berkurang menjadi 2.5 Volt"
        ],
        correctAnswer: 2 // Jawaban benar nya "Berkurang menjadi 3.75 Volt"
    },
    {
        text: "Sebuah kabel penghantar panjang memiliki hambatan yang bergantung pada suhunya. Pada suhu kamar (25°C), hambatan kawat adalah 10 Ohm. Jika suhu kawat dinaikkan menjadi 100°C dengan koefisien suhu resistansi 0.004/°C, berapakah hambatan baru kawat tersebut?",
        answers: [
            "11 Ohm",
            "12 Ohm",
            "14 Ohm",
            "16 Ohm"
        ],
        correctAnswer: 1 // Jawaban benar nya "12 Ohm"
    },
    {
        text: "Sebuah rangkaian terdiri dari tiga resistor dengan nilai R1 = 10 Ohm, R2 = 5 Ohm, dan R3 = 20 Ohm, disusun dalam konfigurasi campuran (seri dan paralel) dengan sumber tegangan 40 Volt. Jika R1 dan R2 dalam paralel dan gabungannya seri dengan R3, berapakah arus total yang mengalir melalui rangkaian?",
        answers: [
            "1 A",
            "2 A",
            "4 A",
            "0.5 A"
        ],
        correctAnswer: 0 // Jawaban benar nya "1 A"
    }
];

let currentQuestion = 0;
let progressIncrement = 100 / questions.length;
let isAnswered = false;

function loadQuestion(index) {
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const questionNumber = document.getElementById('question-number');
    const progressBar = document.getElementById('progress');
    const nextButton = document.getElementById('next-button'); // Tombol next

    // Sembunyikan tombol "Next" saat pertanyaan baru dimuat
    nextButton.style.display = 'none';

    questionText.innerHTML = `<p>${questions[index].text}</p>`;
    
    answersContainer.innerHTML = '';
    questions[index].answers.forEach((answer, i) => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="radio" name="answer" value="${i}"> ${answer}`;
        answersContainer.appendChild(label);
    });

    questionNumber.textContent = `${index + 1} / ${questions.length}`;
    isAnswered = false;

    const labels = document.querySelectorAll('.answers label'); 
    labels.forEach((label, i) => {
        label.addEventListener('click', function() {
            if (!isAnswered) {
                isAnswered = true;

                labels.forEach(lbl => {
                    lbl.style.pointerEvents = 'none';
                });

                labels.forEach(lbl => {
                    lbl.style.backgroundColor = 'white';
                    lbl.style.borderColor = '#EAEAEA';
                });

                const correctAnswerIndex = questions[index].correctAnswer;
                if (i === correctAnswerIndex) {
                    this.style.backgroundColor = '#e0ffe0';
                    this.style.borderColor = 'green';
                } else {
                    this.style.backgroundColor = '#ffe0e0';
                    this.style.borderColor = 'red';
                    labels[correctAnswerIndex].style.backgroundColor = '#e0ffe0';
                    labels[correctAnswerIndex].style.borderColor = 'green';
                }

                const progress = (currentQuestion + 1) * progressIncrement;
                progressBar.style.width = `${progress}%`;

                // Tampilkan tombol "Next" setelah jawaban dipilih
                nextButton.style.display = 'block';
            }
        });
    });
}

document.getElementById('next-button').addEventListener('click', () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion(currentQuestion);

        if (currentQuestion === questions.length - 1) {
            const nextButton = document.getElementById('next-button');
            nextButton.textContent = 'Finish';
            nextButton.removeEventListener('click', nextQuestionHandler);
            nextButton.addEventListener('click', finishQuiz);
        }
    }
});

function finishQuiz() {
    alert("Quiz Selesai! Terima kasih telah mengikuti.");
}

document.getElementById('progress').style.width = '0%';

loadQuestion(currentQuestion);