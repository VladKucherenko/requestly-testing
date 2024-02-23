import { FormEvent, useEffect, useState } from "react";
import "./App.css";
import {
  getSpreasheetData,
  updateSpreadsheetData,
} from "./api/sheets";

interface Todo {
  id: number; // Unique identifier for the todo within the list
  value: string; // Text content of the todo
  isCompleted: boolean; // Flag indicating if the todo is completed

  isNew: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<string>("");
  const [error, setError] = useState<string | null>(null)

  const loadTodos = async () => {
    try {
      // load the todos from the spreadsheet
      // const response = await getTestData();
      const response = await getSpreasheetData();
      console.log(response)
      const todos = response.values.map((t: string[]) => ({
        id: parseInt(t[0]),
        value: t[1],
        isCompleted: t[2] === "TRUE",
        isNew: t[3] === "TRUE",
      }));
      setTodos(todos);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    } catch (error: never) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setError(error.message);
      console.log('error', error)
    }
  };

  useEffect(() => {
    console.log(`Loading todos...`);
    loadTodos();
  }, []);

  const toggleTodo = (id: number) => {
    // toggle the isCompleted flag of the todo
    console.log(`toggling todo with id: ${id}`);
    setTodos((prev) =>
      prev.map((p, index) => {
        if (p.id === id) {
          const updatedTodo = { ...p, isCompleted: !p.isCompleted };
          updateSpreadsheetData(index, [
            updatedTodo.id,
            updatedTodo.value,
            updatedTodo.isCompleted.toString(),
          ]);
          return updatedTodo;
        } else {
          return p;
        }
      })
    );
  };

  return (
    <div className="container">
      <h1 className="title">Todos</h1>
      {/* Input Area to add new todos */}
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          // addTodo(todo);
        }}
      >
        <input
          className="todo-input"
          type="text"
          name="todo"
          placeholder="Add a todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          autoFocus
        />
        <button className="submit-btn" type="submit">
          Add
        </button>
      </form>

      {error && (
          <span style={{ color: 'red' }}>
           {error}
          </span>
      )}

      <ul className="todos">
        {todos.map((t) => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.isCompleted}
              onChange={() => {
                toggleTodo(t.id);
              }}
            />
            <span className="todo">
              {t.value}
              {/*{t.isNew && (<div style={{ marginLeft: '8px', color: 'green'}}> NEW </div>)}*/}
            </span>
            <button
              type="button"
              className="delete-btn"
              onClick={(e) => {
                e.preventDefault();
                // removeTodo(t.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
