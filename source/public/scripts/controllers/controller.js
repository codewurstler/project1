import todoService from "../services/service.js";
import ModeController from "../../../controller/mode-controller.js";
//import { todoController } from "../../../controller/todo-controller.js";

//initialize dark mode
const modeController = new ModeController();
modeController.init();

const todoDialog = document.querySelector("#todo-dialog");
const createTodoBtn = document.querySelector("#btn-create");
const todoSubmitBtn = document.querySelector("#todo-submit");
const todoUpdateBtn = document.querySelector("#todo-update");
const todoCancelBtn = document.querySelector("#todo-cancel");
const todoForm = document.querySelector("#todo-form");
const todos = todoService.getTodos();

/* TO SWITCH TO HANDLEBARS
const templateSource = document.querySelector("#todo-item-template").innerHTML;
const template = Handlebars.compile(templateSource);
function renderTodos() {
  document.querySelector(".todo-list-handle").innerHTML = template(todos);
}
renderTodos();
*/

createTodoBtn.addEventListener("click", () => {
  todoDialog.showModal();
  todoForm.reset();
  todoUpdateBtn.style.display = "none";
  todoSubmitBtn.style.display = "inline-block";
});

todoCancelBtn.addEventListener("click", () => {
  todoDialog.close();
});

let currentTodo;

function loadTodoToForm(todo) {
  todoSubmitBtn.style.display = "none";
  todoUpdateBtn.style.display = "inline-block";
  document.querySelector("#title").value = todo.title;
  document.querySelector("#description").value = todo.description;
  document.querySelector("#date").value = todo.date;
  document.querySelector("#importance").value = todo.importance;
  document.querySelector("#status").value = todo.status;
  currentTodo = todo;
}

const getItemFromForm = () => ({
  id: currentTodo.id,
  title: document.querySelector("#title").value,
  description: document.querySelector("#description").value,
  date: document.querySelector("#date").value,
  importance: document.querySelector("#importance").value,
  status: document.querySelector("#status").value,
});

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
      todoService.deleteTodo(todo);
      showTodos();
    });

    editBtn.addEventListener("click", () => {
      todoDialog.showModal();
      loadTodoToForm(todo);
    });
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
}

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
showTodos();

const todoList = document.querySelector(".todo-list");
const openFilterBtn = document.querySelector("#btn-filter-done");
let filterDone = localStorage.getItem("filter-done");

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

const filterName = document.querySelector("#btn-filter-name");
filterName.addEventListener("click", () => {
  const todos = todoService.getTodos();
  todos.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
  showTodos();
});

const filterDate = document.querySelector("#btn-filter-duedate");
filterDate.addEventListener("click", () => {
  const todos = todoService.getTodos();
  todos.sort((a, b) => {
    return a.date.localeCompare(b.date);
  });
  showTodos();
});

const filterImportance = document.querySelector("#btn-filter-importance");
filterImportance.addEventListener("click", () => {
  const todos = todoService.getTodos();
  todos.sort((a, b) => {
    return a.importance - b.importance;
  });
  showTodos();
});
