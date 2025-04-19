window.onload = () => {
  loadTasks();
};

let modebtn = document.querySelector("#mode-btn");
let currMode = "light";


modebtn.addEventListener("click", () => {
  if (currMode === "light") {
    currMode = "dark";
    document.body.style.backgroundColor = "black";
    modebtn.innerText = "Enable Light Mode";
  } else {
    currMode = "light";
    document.body.style.backgroundColor = "white";
    modebtn.innerText = "Enable Dark Mode";
  }
});

function addTask() {
  const input = document.getElementById('addTasks');
  const taskText = input.value.trim();
  if (taskText === '') return;

  const task = {
    text: taskText,
    date: formatDate(new Date()),
    completed: false
  };

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  displayTask(task);
  input.value = '';
}

function displayTask(task) {
  const taskList = document.getElementById('task-list');
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task';

  if (task.completed) {
    taskDiv.classList.add('completed');
  }

  taskDiv.innerHTML = `
    <div class="text">
      <strong>${task.text}</strong>
      <div class="date">${task.date}</div>
    </div>
    <div class="actions">
      <button onclick="markDone(this)">✔</button>
      <button onclick="deleteTask(this)">✖</button>
    </div>
  `;

  taskList.appendChild(taskDiv);
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(displayTask);
}

function markDone(btn) {
  const taskDiv = btn.closest('.task');
  const taskText = taskDiv.querySelector('.text strong').textContent;
  taskDiv.classList.toggle('completed');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.map(task => {
    if (task.text === taskText) {
      task.completed = !task.completed;
    }
    return task;
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(btn) {
  const taskDiv = btn.closest('.task');
  const taskText = taskDiv.querySelector('.text strong').textContent;
  taskDiv.remove();

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(t => t.text !== taskText);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function searchTasks() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const tasks = document.querySelectorAll('#task-list .task');
  let found = false;

  tasks.forEach(task => {
    const text = task.querySelector('.text strong').textContent.toLowerCase();
    if (text.includes(input)) {
      task.style.display = 'flex';
      found = true;
    } else {
      task.style.display = 'none';
    }
  });

  if (!found) {
    alert("Task not found!");
  }
}

function sortTasks() {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  tasks.sort((a, b) => a.text.localeCompare(b.text));

  localStorage.setItem('tasks', JSON.stringify(tasks));

  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  tasks.forEach(displayTask);
}
