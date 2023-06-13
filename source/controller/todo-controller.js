import { todoStore } from "../services/todo-store.js";

export class TodoController {
  getTodos = async (req, res) => {
    res.json(await todoStore.all());
  };

  createTodo = async (req, res) => {
    res.json(
      await todoStore.add(
        req.body.id,
        req.body.title,
        req.body.description,
        req.body.date,
        req.body.importance,
        req.body.status
      )
    );
  };

  deleteTodo = async (req, res) => {
    res.json(await todoStore.delete(req.params.id));
  };

  updateTodo = async (req, res) => {
    res.json(
      await todoStore.update(
        req.body.id,
        req.body.title,
        req.body.description,
        req.body.date,
        req.body.importance,
        req.body.status
      )
    );
  };

  getTodo = async (req, res) => {
    res.json(await todoStore.get(req.params.id));
  };
}

export const todoController = new TodoController();
