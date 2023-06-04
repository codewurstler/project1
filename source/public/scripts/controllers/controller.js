import todoService from "../services/service.js";

document.querySelector("#btn-style").addEventListener("click", changeMode);
function changeMode() {
  const element = document.body;
  element.classList.toggle("dark-mode");
}

// maybe not so good
let currentTodo;

// HIDE AND SHOW FORM
const form = document.querySelector("#todo-form");
const todoList = document.querySelector(".todo-list-container");
function showForm() {
  form.style.display = "block";
  todoList.style.display = "none";
}
function hideForm() {
  form.style.display = "none";
  todoList.style.display = "block";
}

document.querySelector("#btn-create").addEventListener("click", showForm);
document.querySelector("#todo-input").addEventListener("click", hideForm);
document.querySelector("#todo-update").addEventListener("click", hideForm);

const todoForm = document.querySelector("#todo-form");

function showTodos() {
  const todos = todoService.getTodos();
  const showTodoList = document.querySelector(".todo-list");

  showTodoList.innerHTML = "";

  todos.forEach((todo) => {
    // CREATE TODO ITEM
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-list-item");

    // CHECKING TODO IMPORTANCE
    function todoImportance() {
      if (todo.importance === "1") {
        todoItem.classList.add("importance-1");
      }
      if (todo.importance === "2") {
        todoItem.classList.add("importance-2");
      }
      if (todo.importance === "3") {
        todoItem.classList.add("importance-3");
      }
      if (todo.importance === "4") {
        todoItem.classList.add("importance-4");
      }
      if (todo.importance === "5") {
        todoItem.classList.add("importance-5");
      }
      return "No importance selected";
    }
    todoImportance();

    function todoStatus() {
      if (todo.status === "done") {
        todoItem.classList.add("status-done");
      }
    }
    todoStatus();

    // SET TODO ITEM INNER HTML
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

    // DELETE TODO
    deleteBtn.addEventListener("click", () => {
      localStorage.setItem("todos", JSON.stringify(todos));
      showTodos();
    });

    const editBtn = todoItem.querySelector("#btn-list-item-edit");

    editBtn.addEventListener("click", () => {
      showForm();
      document.querySelector("#title").value = todo.title;
      document.querySelector("#description").value = todo.description;
      document.querySelector("#date").value = todo.date;
      document.querySelector("#importance").value = todo.importance;
      document.querySelector("#status").value = todo.status;
      currentTodo = todo;
    });
  });

  const getItemFromForm = () => ({
    id: currentTodo.id,
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

  const updateBtn = document.querySelector("#todo-update");
  updateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    updateItems();
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

  showTodos();
});
showTodos();

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
    return a.importance.localeCompare(b.importance);
  });
  showTodos();
});

const filterStatus = document.querySelector("#btn-filter-status");
filterStatus.addEventListener("click", () => {
  const todos = todoService.getTodos();
  todos.sort((a, b) => {
    return b.status.localeCompare(a.status);
  });
  showTodos();
});
