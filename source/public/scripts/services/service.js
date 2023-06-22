import { httpService } from "./http-service.js";

class TodoService {
  async getTodos() {
    return httpService.ajax("GET", "/todos/", undefined);
  }

  async addTodo(todo) {
    return httpService.ajax("POST", "/todos/", todo);
  }

  async updateTodo(todo) {
    return httpService.ajax("PUT", `/todos/${todo.id}`, todo);
  }

  async deleteTodo(todo) {
    return httpService.ajax("DELETE", `/todos/${todo}`, undefined);
  }
}

export default new TodoService();
