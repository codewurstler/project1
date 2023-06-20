import todoService from "../services/service.js";
import ModeController from "./mode-controller.js";

// Dialog
const todoDialog = document.querySelector("#todo-dialog");
const createTodoBtn = document.querySelector("#btn-create");
const todoSubmitBtn = document.querySelector("#todo-submit");
const todoUpdateBtn = document.querySelector("#todo-update");
const todoCancelBtn = document.querySelector("#todo-cancel");
const todoForm = document.querySelector("#todo-form");

// Show done
const todoList = document.querySelector(".todo-list");
const openFilterBtn = document.querySelector("#btn-filter-done");
let filterDone = localStorage.getItem("filter-done");

// Filters
const filterForm = document.querySelector("#filter-form");
let filterStatus = localStorage.getItem("filter-status");
const filterCancel = document.querySelector("#filter-cancel");

// Get the todos from the server
const todos = await todoService.getTodos();

// Init dark mode
new ModeController().init();

// Render todos

// Gets the values in the loop for updating
function loadTodoToForm(todo) {
  todoSubmitBtn.style.display = "none";
  todoUpdateBtn.style.display = "inline-block";
  document.querySelector("#id").value = todo._id;
  document.querySelector("#title").value = todo.title;
  document.querySelector("#description").value = todo.description;
  document.querySelector("#date").value = todo.date;
  document.querySelector("#importance").value = todo.importance;
  document.querySelector("#status").value = todo.status;
}

function showTodos() {
  const showTodoList = document.querySelector(".todo-list");

  showTodoList.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-list-item");

    todoItem.classList.add(`importance-${todo.importance}`);

    todoItem.classList.add(`status-${todo.status}`);

    todoItem.innerHTML = `
      <div class="todo-list-item-inner-1">
            <p>${todo.date}</p>
            <p>${todo.status}</p>
      </div>
          <div class="todo-list-item-inner-2">
            <p>${todo.title}</p>
            <p>${todo.description}</p>
          </div>
          <div class="todo-list-item-inner-3">
            <div class="todo-list-item-inner-status"></div>
          </div>
          <div class="todo-list-item-inner-4">
            <button id="btn-list-item-edit" class="btn">Edit</button>
            <button id="btn-list-item-delete" class="btn warning">Delete</button>
          </div>
  `;

    showTodoList.appendChild(todoItem);

    const deleteBtn = todoItem.querySelector("#btn-list-item-delete");
    const editBtn = todoItem.querySelector("#btn-list-item-edit");

    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this todo?") === true) {
        todoService.deleteTodo(todo);
        showTodos();
      }
    });

    editBtn.addEventListener("click", () => {
      todoDialog.showModal();
      loadTodoToForm(todo);
    });
  });
}
showTodos();

// Create todo
createTodoBtn.addEventListener("click", () => {
  todoDialog.showModal();
  todoForm.reset();
  todoUpdateBtn.style.display = "none";
  todoSubmitBtn.style.display = "inline-block";
});

todoCancelBtn.addEventListener("click", () => {
  todoDialog.close();
});

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoItem = {
    title: document.querySelector("#title").value,
    description: document.querySelector("#description").value,
    date: document.querySelector("#date").value,
    importance: document.querySelector("#importance").value,
    status: document.querySelector("#status").value,
  };

  todoService.addTodo(todoItem);

  e.target.reset();
  todoDialog.close();
  showTodos();
});

// Update todo

const getItemFromForm = () => ({
  id: document.querySelector("#id").value,
  title: document.querySelector("#title").value,
  description: document.querySelector("#description").value,
  date: document.querySelector("#date").value,
  importance: document.querySelector("#importance").value,
  status: document.querySelector("#status").value,
});

function updateItems() {
  todoService.updateTodo(getItemFromForm());
  showTodos();
}

todoUpdateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  updateItems();
  todoDialog.close();
});

// Show done
const enableFilterDone = () => {
  todoList.classList.add("filter-done");
  openFilterBtn.classList.add("active");
  localStorage.setItem("filter-done", "enabled");
};

const disableFilterDone = () => {
  todoList.classList.remove("filter-done");
  openFilterBtn.classList.remove("active");
  localStorage.setItem("filter-done", "disabled");
};

if (filterDone === "enabled") {
  enableFilterDone();
}

openFilterBtn.addEventListener("click", () => {
  filterDone = localStorage.getItem("filter-done");
  if (filterDone === "enabled") {
    disableFilterDone();
  } else {
    enableFilterDone();
  }
});

// Filters

function initFilterStatus() {
  if (filterStatus === null) {
    filterStatus = "disabled";
  }
  document.querySelector("#filter").value = filterStatus;
  localStorage.setItem("filter-status", filterStatus);

  if (filterStatus === "disabled") {
    filterForm.classList.add("filter-disabled");
  } else {
    filterForm.classList.remove("filter-disabled");
  }
}
initFilterStatus();

function runFilters() {
  if (filterStatus === "name") {
    todos.sort((a, b) => a.title.localeCompare(b.title));
  } else if (filterStatus === "duedate") {
    todos.sort((a, b) => a.date.localeCompare(b.date));
  } else if (filterStatus === "importance") {
    todos.sort((a, b) => b.importance - a.importance);
  }
  showTodos();
}

filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const filterStatusValue = document.querySelector("#filter").value;
  localStorage.setItem("filter-status", filterStatusValue);
  filterForm.classList.remove("filter-disabled");
  runFilters();
});

filterCancel.addEventListener("click", () => {
  localStorage.setItem("filter-status", "disabled");
  filterForm.classList.add("filter-disabled");
  showTodos();
});
runFilters();
