import Datastore from "nedb-promises";

export class TodoItem {
  constructor(id, title, description, date, importance, status) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.date = date;
    this.importance = importance;
    this.status = status;
  }
}

export class TodoStore {
  constructor(db) {
    this.db =
      db || new Datastore({ filename: "./data/todos.db", autoload: true });
  }

  async add(id, title, description, date, importance, status) {
    const todoItem = new TodoItem(
      id,
      title,
      description,
      date,
      importance,
      status
    );
    return this.db.insert(todoItem);
  }

  async delete(id) {
    await this.db.remove({ _id: id });
    return this.get(id);
  }

  async update(id, title, description, date, importance, status) {
    return this.db.update(
      { _id: id },
      { $set: { title, description, date, importance, status } }
    );
  }

  async get(id) {
    return this.db.findOne({ _id: id });
  }

  async all(todos) {
    return this.db.find(todos);
  }
}

export const todoStore = new TodoStore();
