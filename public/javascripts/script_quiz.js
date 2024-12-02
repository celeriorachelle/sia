// document.addEventListener('DOMContentLoaded', function() {
//     const questionsData = document.getElementById('questionsData').value;
//     const questions = JSON.parse(questionsData);
//     const quizForm = document.getElementById('quizForm');
//     const scoreContainer = document.getElementById('scoreContainer');
//     const retryButton = document.createElement('button'); 
//     retryButton.id = 'retryButton';

//     quizForm.addEventListener('submit', function(event) {
//         event.preventDefault();

//         if (event.submitter && event.submitter.innerText === 'Retry Quiz') {
//             window.location.href = '/quiz'; 
//             return;
//         }

//         let answers = {};
//         let formData = new FormData(quizForm);

//         for (let entry of formData.entries()) {
//             answers[entry[0]] = entry[1];
//         }

//         let allQuestionsAnswered = true;
//         for (let i = 0; i < questions.length; i++) {
//             if (!answers['question' + i]) {
//                 allQuestionsAnswered = false;
//                 break;
//             }
//         }

//         const existingAlert = document.getElementById('incompleteAlert');
//         if (!allQuestionsAnswered) {
//             if (!existingAlert) {
//                 const incompleteDiv = document.createElement('div');
//                 incompleteDiv.innerText = 'Please answer all the questions';
//                 incompleteDiv.style.marginBottom = '10px';
//                 incompleteDiv.id = 'alertDiv';

//                 const okayButton = document.createElement('button');
//                 okayButton.innerText = 'Okay';
//                 okayButton.id = 'okayButton';

//                 okayButton.addEventListener('click', function() {
//                     incompleteDiv.remove();
//                     okayButton.remove();
//                 });

//                 quizForm.appendChild(incompleteDiv);
//                 incompleteDiv.appendChild(okayButton);

//                 requestAnimationFrame(() => {
//                     incompleteDiv.style.transform = 'translate(-50%, -50%) scale(1)'; 
//                     incompleteDiv.style.opacity = '1'; 
//                 });
//             }
//             return;
//         }

//         let score = 0;
//         scoreContainer.innerHTML = '';
//         questions.forEach((question, index) => {
//             if (answers['question' + index] === question.correct_answer) {
//                 score++;
//             }

//             const correctAnswer = document.getElementById('correctAns');
//             correctAnswer.id = 'visibleAns';
//         });

//         const scoreDiv = document.createElement('div');
//         scoreDiv.id = 'scoreDiv';
//         scoreDiv.innerText = `You scored ${score} out of ${questions.length}`;
//         scoreContainer.appendChild(scoreDiv);

//         window.scrollTo({ top: 0, behavior: 'smooth' });

//         retryButton.innerText = 'Retry Quiz';
//         retryButton.addEventListener('click', function() {
//             window.location.href = '/quiz';
//         });

//         scoreContainer.appendChild(retryButton);

//         const submitButton = document.getElementById('btnSubmit');
//         submitButton.disabled = true;
//         submitButton.style.display = 'none';

//         // Redirect logic for submitting quiz results
//         const name = document.getElementById('name').value;
//         const scoreInput = document.getElementById('score');
//         scoreInput.value = score;  // Set the score value to be sent with the form

//         // Perform the submit via fetch or redirect
//         setTimeout(function() {
//             window.location.href = `/quiz/records?name=${name}&score=${score}`;
//         }, 2000);  // Delay the redirect to allow time for score display
//     });
// });
