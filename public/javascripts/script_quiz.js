// document.getElementById('btnSubmit').addEventListener('click', async function () {
//     const sessionData = JSON.parse(document.getElementById('sessionData').value);  // Access session data

//     // Collect user answers and submit them
//     const questionsData = JSON.parse(document.getElementById('questionsData').value);
//     const userAnswers = {};

//     let allAnswered = true;

//     // Validate and collect answers
//     questionsData.forEach((_, index) => {
//         const options = document.getElementsByName(`answers[${index}]`);
//         const selectedOption = [...options].find((option) => option.checked);

//         if (selectedOption) {
//             userAnswers[index] = selectedOption.value;
//         } else {
//             allAnswered = false;
//         }
//     });

//     if (!allAnswered) {
//         alert('Please answer all questions before submitting.');
//         return;
//     }

//     // Send data via fetch
//     try {
//         const response = await fetch('/quiz/submit', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 name: sessionData.name,
//                 startDate: sessionData.startDate,
//                 type: sessionData.type,
//                 answers: userAnswers,
//             }),
//         });

//         if (response.ok) {
//             const responseData = await response.json();
//             window.location.href = `/quiz/records?name=${encodeURIComponent(sessionData.name)}&score=${responseData.score}`;
//         } else {
//             console.error('Error submitting quiz:', response.statusText);
//             alert('Failed to submit quiz. Please try again later.');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred while submitting the quiz.');
//     }
// });