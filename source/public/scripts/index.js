// CHANGE STYLE
document.querySelector("#btn-style").addEventListener("click", changeMode);
function changeMode() {
  const element = document.body;
  element.classList.toggle("dark-mode");
}

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

window.addEventListener("load", () => {
  todos = JSON.parse(localStorage.getItem("todos")) || [];

  const todoForm = document.querySelector("#todo-form");

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const todoItem = {
      title: document.querySelector("#title").value,
      description: document.querySelector("#description").value,
      date: document.querySelector("#date").value,
      importance: document.querySelector("#importance").value,
      status: document.querySelector("#status").value,
    };

    todos.push(todoItem);

    localStorage.setItem("todos", JSON.stringify(todos));

    e.target.reset();

    showTodos();
  });
  showTodos();
});

function showTodos() {
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
      } else if (todo.importance === "2") {
        return "&#9888; &#9888;";
      } else if (todo.importance === "3") {
        return "&#9888; &#9888; &#9888;";
      } else if (todo.importance === "4") {
        return "&#9888; &#9888; &#9888; &#9888;";
      } else if (todo.importance === "5") {
        return "&#9888; &#9888; &#9888; &#9888; &#9888;";
      } else {
        return "No importance selected";
      }
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
          </div>
  `;
    todoList.appendChild(todoItem);
  });
}
