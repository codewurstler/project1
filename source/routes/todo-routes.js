import express from "express";

const router = express.Router();
import { TodoController } from "../controller/todo-controller.js";

router.get("/", TodoController.getTodos);
router.post("/", TodoController.createTodo);
router.delete("/:id", TodoController.deleteTodo);
//ist put die korrekte Methode zum updaten?
router.put("/:id", TodoController.updateTodo);
router.get("/:id", TodoController.getTodo);
export const todoRoutes = router;
