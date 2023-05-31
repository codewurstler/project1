import todoService from "../services/service.js";

document.querySelector("#btn-style").addEventListener("click", changeMode);
function changeMode() {
  const element = document.body;
  element.classList.toggle("dark-mode");
}

// maybe not so good
let currentTodo;
//HIDE AND SHOW FORM
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
document.querySelector("#todo-overview").addEventListener("click", hideForm);
document
  .querySelector("#todo-input-overview")
  .addEventListener("click", hideForm);

const todoForm = document.querySelector("#todo-form");

function showTodos() {
  const todos = todoService.getTodos();
  const showTodoList = document.querySelector(".todo-list");

  showTodoList.innerHTML = "";

  // CHECKING TODO STATUS
  todos.forEach((todo) => {
    function todoStatus() {
      if (todo.status === "done") {
        return "Done";
      } else {
        return "Open";
      }
    }
    const todoStatusLabel = todoStatus();

    // CHECKING TODO IMPORTANCE
    function todoImportance() {
      if (todo.importance === "1") {
        return "&#9888;";
      }
      if (todo.importance === "2") {
        return "&#9888; &#9888;";
      }
      if (todo.importance === "3") {
        return "&#9888; &#9888; &#9888;";
      }
      if (todo.importance === "4") {
        return "&#9888; &#9888; &#9888; &#9888;";
      }
      if (todo.importance === "5") {
        return "&#9888; &#9888; &#9888; &#9888; &#9888;";
      }
      return "No importance selected";
    }

    const todoImportanceLabel = todoImportance();

    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-list-item");
    todoItem.innerHTML = `
      <div class="todo-list-item-inner-1">
            <p>${todo.date}</p>
            <input type="checkbox" id="todo-completion" name="todo-completion" value="${todo.status}">
            <label for="todo-completion">${todoStatusLabel}</label>
      </div>
          <div class="todo-list-item-inner-2">
            <p>${todo.title}</p>
            <p>${todo.description}</p>
          </div>
          <div class="todo-list-item-inner-3">
            <p>${todoImportanceLabel}</p>
          </div>
          <div class="todo-list-item-inner-4">
            <button id="btn-list-item-edit" class="btn">Edit</button>
            <button id="btn-list-item-delete" class="btn warning">Delete</button>
          </div>
  `;

    todoList.appendChild(todoItem);

    const deleteBtn = todoItem.querySelector("#btn-list-item-delete");

    // DELETE TODO
    deleteBtn.addEventListener("click", () => {
      localStorage.setItem("todos", JSON.stringify(todos));
      // a fix for displaying todos after deleting one -> should actually be done with a function
      window.location.reload();
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
// needs fixing because it shows double todos
showTodos();
