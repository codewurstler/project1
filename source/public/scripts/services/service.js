import { httpService } from "./http-service.js";

class TodoService {
  async getTodos() {
    return httpService.ajax("GET", "/todos/", undefined);
  }

  async addTodo(todo) {
    return httpService.ajax("POST", "/todos/", todo);
  }

  async updateTodo(id, todo) {
    return httpService.ajax("PUT", `/todos/${id}`, todo);
  }

  async deleteTodo(todo) {
    return httpService.ajax("DELETE", `/todos/${todo}`, undefined);
  }
}

export default new TodoService();
