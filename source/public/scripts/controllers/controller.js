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
const filterFormInput = document.querySelector("#filter");
let filterStatus = localStorage.getItem("filter-status");
const filterCancel = document.querySelector("#filter-cancel");

// Get the todos from the server
const todos = await todoService.getTodos();

// Init dark mode
new ModeController().init();

const templateSource = document.querySelector("#todo-item-template").innerHTML;
const template = Handlebars.compile(templateSource);
function renderTodos() {
  document.querySelector(".todo-list").innerHTML = template(todos);
}
renderTodos();

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

const editBtn = document.querySelector("#btn-list-item-edit");

editBtn.addEventListener("click", () => {
  todoDialog.showModal();
  //loadTodoToForm(todo);
});

function deleteNote(event) {
  event.preventDefault();
  if (window.confirm("Are you sure you want to delete this todo?")) {
    const todo = event.target.closest(".todo-list-item").dataset.id;
    todoService.deleteTodo(todo);
  }
}
document
  .querySelectorAll(".btn-list-item-delete")
  .forEach((todo) => todo.addEventListener("click", (e) => deleteNote(e)));

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
  renderTodos();
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
  filterFormInput.value = filterStatus;
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
  filterFormInput.value = null;
  showTodos();
});
runFilters();
