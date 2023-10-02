const todoForm = document.querySelector("#todo-form");
const todoList = document.querySelector(".todos");
const totalTasks = document.querySelector("#total-tasks");
const completedTasks = document.querySelector("#completed-tasks");
const remainingTasks = document.querySelector("#remaining-tasks");
const mainInput = document.querySelector("#todo-form input");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.getItem("tasks")) {
    tasks.map((task) => {
        createTask(task)
    })
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = mainInput.value;

  if (inputValue == '') {
    return;
  }

  const task = {
    id: new Date().getTime(),
    name: inputValue,
    isCompleted: false,
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  createTask(task);

  todoForm.reset()
  mainInput.focus()
})


todoList.addEventListener('click', (e) => {
    if(e.target.classList.contains('remove-task') || e.target.parentElement.classList.contains('remove-task') || e.target.parentElement.parentElement.classList.contains('remove-task') ){
        const taskId = e.target.closest('li').id

        removeTask(taskId)
    }
})

todoList.addEventListener('input', (e) => {
    const taskId =  e.target.closest('li').id

    updateTask(taskId, e.target)
})

todoList.addEventListener('keyDown', (e) => {
    if(e.keyCode == 13){
        e.preventDefault()

        e.target.blur()
    }
})


function createTask(task) {
  const taskEL = document.createElement("li");
  taskEL.setAttribute("id", task.id);

  if (task.isCompleted) {
    taskEL.classList.add("complete");
  }

  const taskMarkup = `
                <div>
                    <input type="checkbox" name="tasks" id="${task.id}" ${task.isCompleted ? "checked" : " "}>
                    <span ${!task.isCompleted ? 'contenteditable' : " "}>${task.name}</span>
                </div>
                <button title="Remove the ${task.name} task" class="remove-task">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>
                </button>
    `
    taskEL.innerHTML = taskMarkup

    todoList.appendChild(taskEL)
    countTasks()
}

function countTasks() {
    const completedTasksArray = tasks.filter((task) => task.isCompleted ==  true)

    totalTasks.textContent = tasks.length
    completedTasks.textContent =  completedTasksArray.length
    remainingTasks.textContent = tasks.length - completedTasksArray.length
}

function removeTask(taskId){
    tasks = tasks.filter((task) => task.id != parseInt(taskId))

    localStorage.setItem('tasks', JSON.stringify(tasks))

    document.getElementById(taskId).remove()

    countTasks()
}

function updateTask(taskId, el){
    const task = tasks.find((task) => task.id == parseInt(taskId))

    if (el.hasAttribute('contenteditable')) {
        task.name = el.textContent
    } else {
        const span = el.nextElementSibling
        const parent = el.closest('li')

        task.isCompleted = !task.isCompleted
        if(task.isCompleted){
            span.removeAttribute('contenteditable')
            parent.classList.add('complete')
        } else{
            span.setAttribute('contenteditable', 'true')
            parent.classList.remove('complete')
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks))

    countTasks()
} 