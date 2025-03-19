// Get the elements
const todoList = document.querySelector('.todo-list');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');
const secondsDisplay = document.getElementById('seconds');
const minutesDisplay = document.getElementById('minutes');
const inputTask = document.getElementById('input-task');

let timer;
let intervalId;

// Define the tasks array
let tasks = [];

// Function to render the todo list
function renderTodoList() {
    const html = tasks.map((task, index) => `
        <li>
            ${index + 1}. ${task.name}
            <button class="delete-button" data-index="${index}">Delete</button>
        </li>
    `).join('');
    todoList.innerHTML = html;
}

// Function to add a new task
function addTask(name) {
    tasks.push({ name, completed: false });
    renderTodoList();
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTodoList();
}

// Function to toggle task completion
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTodoList();
}

// Function to start the timer
function startTimer() {
    const intervalId = setInterval(() => {
        // decrement the seconds and minutes
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        document.getElementById('minutes').textContent = hours.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = mins.toString().padStart(2, '0');
        seconds--;
        if (hours > 0 && minutes === 0 && seconds === 0) {
            clearInterval(intervalId);
            alert('Pomodoro time is up!');
            startButton.disabled = false;
            stopButton.disabled = true;
        }
    }, 1000);
}

// Function to stop the timer
function stopTimer() {
    clearInterval(intervalId);
    document.getElementById('seconds').textContent = '00:00';
    document.getElementById('minutes').textContent = '00';
    startButton.disabled = true;
    stopButton.disabled = false;
}

// Function to reset the timer
function resetTimer() {
    seconds = 25 * 60; // default Pomodoro time
    document.getElementById('seconds').textContent = `${Math.floor(seconds / 60)}:${seconds % 60}`;
    startButton.disabled = false;
    stopButton.disabled = true;
}

// Function to increment the seconds and minutes
function incrementSeconds() {
    const intervalId = setInterval(() => {
        seconds++;
        document.getElementById('seconds').textContent = Math.floor(seconds / 60).toString().padStart(2, '0') + ':' + Math.floor(seconds % 60).toString().padStart(2, '0');
        if (seconds === 25 * 60) {
            clearInterval(intervalId);
            startButton.disabled = false;
            stopButton.disabled = true;
        }
    }, 1000);
}

// Add event listener to the input task
inputTask.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const name = inputTask.value.trim();
        if (name !== '') {
            addTask(name);
            inputTask.value = '';
        }
    }
});

// Initialize variables
let seconds = 25 * 60; // default Pomodoro time

startButton.addEventListener('click', () => {
    startTimer();
});

stopButton.addEventListener('click', stopTimer);

resetButton.addEventListener('click', resetTimer);

// Increment the seconds and minutes initially
incrementSeconds();

// Render the todo list and timer
renderTodoList();