import { httpService } from "./http-service.js";

class TodoService {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem("todos")) || [];
  }

  getTodos() {
    return this.todos;
  }

  addTodo(todo) {
    const newTodo = todo;
    newTodo.id = this.todos.length + 1;
    this.todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(this.todos));
    return newTodo;
  }

  updateTodo(todo) {
    const index = this.todos.findIndex((t) => t.id === todo.id);
    this.todos[index] = todo;
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  deleteTodo(todo) {
    const { id } = todo;
    const todoIndex = this.todos.findIndex((t) => t.id === id);
    if (todoIndex !== -1) {
      this.todos.splice(todoIndex, 1);
    }
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }
}

export default new TodoService();
