import todoService from "../services/service.js";
import ModeController from "./mode-controller.js";

const todosContainer = document.querySelector("#todos");

let todos;

// Dialog
const todoDialog = document.querySelector("#todo-dialog");
const createTodoBtn = document.querySelector("#btn-create");
const todoSubmitBtn = document.querySelector("#todo-submit");
const todoUpdateBtn = document.querySelector("#todo-update");
const todoCancelBtn = document.querySelector("#todo-cancel");
const todoForm = document.querySelector("#todo-form");

// Show done
const openFilterBtn = document.querySelector("#btn-filter-done");
let filterDone = localStorage.getItem("filter-done");

// Filters
const filterForm = document.querySelector("#filter-form");
const filterFormInput = document.querySelector("#filter");
let filterStatus = localStorage.getItem("filter-status");
const filterCancel = document.querySelector("#filter-cancel");

// Init dark mode
new ModeController().init();

const templateSource = document.querySelector("#todo-item-template").innerHTML;
const template = Handlebars.compile(templateSource);

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

async function renderTodos() {
  // Get the todos from the server
  todos = await todoService.getTodos();
  todosContainer.innerHTML = template(todos);

  document.querySelectorAll(".btn-list-item-edit").forEach((todoEditButton) => {
    todoEditButton.addEventListener("click", (e) => {
      const editId = e.target.closest(".todo-list-item").dataset.id;
      const editTodo = todos.find((todo) => todo._id === editId);
      loadTodoToForm(editTodo);
      todoDialog.showModal();
    });
  });

  document
    .querySelectorAll(".btn-list-item-delete")
    .forEach((todoDeleteButton) => {
      todoDeleteButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.confirm("Are you sure you want to delete this todo?")) {
          const todo = e.target.closest(".todo-list-item").dataset.id;
          todoService.deleteTodo(todo);
        }
        renderTodos();
      });
    });
}
renderTodos();

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
  renderTodos();
}

todoUpdateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  updateItems();
  todoDialog.close();
});

// Show done
const enableFilterDone = () => {
  todosContainer.classList.add("filter-done");
  openFilterBtn.classList.add("active");
  localStorage.setItem("filter-done", "enabled");
};

const disableFilterDone = () => {
  todosContainer.classList.remove("filter-done");
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
  renderTodos();
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
  renderTodos();
});
runFilters();
