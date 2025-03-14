// Define Pomodoro timer intervals and breaks
const intervals = [25, 50, 75];
const breaks = [5, 10, 25];
const longBreaks = [15, 30, 45];

// Initialize variables
let currentTime = 0;
let currentInterval = 0;
let isWorking = true;
let taskList = [];

// Function to update timer display
function updateTimer() {
  const timerElement = document.getElementById('timer');
  const timeRemaining = intervals[currentInterval] * (1000 - (new Date().getTime() / 1000));
  if (timeRemaining < 0) {
    isWorking = false;
    // Switch to break mode
    currentInterval++;
    if (currentInterval >= breaks.length) {
      currentInterval = longBreaks.indexOf(breaks[currentInterval]);
    }
    currentTime += intervals[currentInterval];
  } else {
    timerElement.innerText = `Time remaining: ${Math.floor(timeRemaining / 1000)} seconds`;
  }
}

// Function to add new task
function addTask(taskName) {
  const taskElement = document.createElement('li');
  taskElement.textContent = `${taskName} - `;
  taskElement.classList.add('completed', 'done');

  // Add event listener for completing task
  taskElement.addEventListener('click', () => {
    taskElement.classList.toggle('done');
  });

  // Append task to task list
  document.getElementById('task-list').appendChild(taskElement);
}

// Function to handle user input for interval and break duration
function handleInput(event) {
  const inputElement = event.target;
  const value = parseInt(inputElement.value);
  if (value > 0 && value <= 60) {
    intervals[currentInterval] = value;
    inputElement.value = '';
  }
}

// Function to start/stop timer
function toggleTimer() {
  isWorking = !isWorking;
  if (!isWorking) {
    // Switch to break mode
    currentInterval++;
    if (currentInterval >= breaks.length) {
      currentInterval = longBreaks.indexOf(breaks[currentInterval]);
    }
    currentTime += intervals[currentInterval];
  } else {
    // Start new interval
    currentTime = 0;
    currentInterval = 0;
  }

  updateTimer();
}

// Initialize event listeners for input fields and timer buttons
document.getElementById('start-button').addEventListener('click', toggleTimer);
document.getElementById('break-button').addEventListener('click', () => {
  isWorking = false;
  currentTime += breaks[breaks.length - 1];
});
document.getElementById('long-break-button').addEventListener('click', () => {
  isWorking = false;
  currentTime += longBreaks[longBreaks.length - 1];
});

// Initialize event listeners for interval and break input fields
document.getElementById('interval-input').addEventListener('input', handleInput);
document.getElementById('break-input').addEventListener('input', handleInput);

// Populate task list with existing tasks
const existingTasks = localStorage.getItem('tasks');
if (existingTasks) {
  const tasksArray = JSON.parse(existingTasks);
  for (const task of tasksArray) {
    addTask(task.name);
  }
}