import express from "express";
import { todoController } from "../controller/todo-controller.js";

const router = express.Router();

router.get("/", todoController.getTodos);
router.post("/", todoController.createTodo);
router.delete("/:id", todoController.deleteTodo);
router.put("/:id", todoController.updateTodo);
router.get("/:id", todoController.getTodo);
export const todoRoutes = router;
