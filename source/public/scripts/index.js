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
  });
});

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

const toDos = [
  {
    title: "Test",
    description: "Lorem ipsum dolor sit am...",
    date: "2023-10-10",
    importance: 1,
    done: false,
  },
  {
    title: "Test 1",
    description: "Lorem ipsum dolor sit am...",
    date: "2023-10-10",
    importance: 3,
    done: false,
  },
  {
    title: "Test 2",
    description: "Lorem ipsum dolor sit am...",
    date: "2023-11-12",
    importance: 4,
    done: true,
  },
  {
    title: "Test 3",
    description: "Lorem ipsum dolor sit am...",
    date: "2023-11-09",
    importance: 2,
    done: false,
  },
];

console.log(toDos.title);
