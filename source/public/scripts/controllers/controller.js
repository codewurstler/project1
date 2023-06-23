import todoService from "../services/service.js";
import ModeController from "./mode-controller.js";

const todosContainer = document.querySelector("#todos");

let todos;

let currentFilter;
let currentFilterOrder;

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
const filterButtons = document.querySelectorAll(".btn-filter");

// Init dark mode
new ModeController().init();

const templateSource = document.querySelector("#todo-item-template").innerHTML;
// eslint-disable-next-line no-undef
const template = Handlebars.compile(templateSource);

function loadTodoToForm(todo) {
  todoForm.classList.add("update");
  document.querySelector("#id").value = todo._id;
  document.querySelector("#title").value = todo.title;
  document.querySelector("#description").value = todo.description;
  document.querySelector("#date").value = todo.date;
  document.querySelector("#importance").value = todo.importance;
  document.querySelector("#status").value = todo.status;
}

async function renderTodos() {
  todos = await todoService.getTodos();

  if (currentFilter !== undefined) {
    if (currentFilterOrder === "desc") {
      todos.sort((a, b) =>
        b[currentFilter]
          .toLowerCase()
          .localeCompare(a[currentFilter].toLowerCase())
      );
    } else {
      todos.sort((a, b) =>
        a[currentFilter]
          .toLowerCase()
          .localeCompare(b[currentFilter].toLowerCase())
      );
    }
  }

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

createTodoBtn.addEventListener("click", () => {
  todoForm.classList.add("create");
  todoDialog.showModal();
  todoForm.reset();
});

todoCancelBtn.addEventListener("click", () => {
  todoDialog.close();
  todoForm.classList.remove("create", "update");
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

filterButtons.forEach((filterButton) => {
  filterButton.addEventListener("click", (e) => {
    e.preventDefault();
    currentFilter = e.target.dataset.sort;

    if (currentFilterOrder === "desc") {
      currentFilterOrder = "asc";
    } else {
      currentFilterOrder = "desc";
    }

    filterButtons.forEach((button) => {
      button.classList.remove("active", "active-asc", "active-desc");
    });

    e.target.classList.add("active", `active-${currentFilterOrder}`);

    renderTodos();
  });
});

new ModeController().init();
renderTodos();
