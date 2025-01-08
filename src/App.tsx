/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/Footer/TodoFooter';
import { TodoHeader } from './components/Header/TodoHeader';
import { TodoErrors } from './components/Errors/TodoErrors';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

export enum ErrorMessage {
  Update = 'Unable to update a todo',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Get = 'Unable to load todos',
  Title = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [filter, setFilter] = useState('All');

  const [errorMessage, setErrorMessage] = useState('');

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [todoId, setTodoId] = useState<number | null>(null);
  const [todoTemp, setTodoTemp] = useState<Todo | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(err => {
        setErrorMessage(ErrorMessage.Get);
        throw err;
      });
  }, []);

  const filterTodos = (filterType: string, todoList: Todo[]) => {
    switch (filterType) {
      case 'All':
        return todoList;
      case 'Active':
        return todoList.filter(todo => todo.completed === false);
      case 'Completed':
        return todoList.filter(todo => todo.completed === true);
      default:
        return todoList;
    }
  };

  const addTodo = async (
    event: React.FormEvent<HTMLFormElement>,
    title: string,
  ) => {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (!title.trim()) {
      setIsLoading(false);
      setErrorMessage(ErrorMessage.Title);

      return;
    }

    setTodoTemp({
      title: title.trim(),
      userId: USER_ID,
      completed: false,
      id: 0,
    });

    try {
      const todo = await createTodo(title);

      setTodos([...todos, todo]);
    } catch (error) {
      setErrorMessage(ErrorMessage.Add);
    } finally {
      setTimeout(() => {
        getTodos();
      }, 300);
      setIsLoading(false);
      setNewTodoTitle('');
      setTodoTemp(null);
    }
  };

  const deleteTodoFunc = async (id: number) => {
    setErrorMessage('');
    setTodoId(id);
    try {
      const response = await deleteTodo(id);

      if (response === 1) {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      } else {
        setErrorMessage(ErrorMessage.Delete);
      }
    } catch {
      setErrorMessage(ErrorMessage.Delete);
    } finally {
      setTodoId(null);
    }
  };

  const deleteCompletedTodo = async () => {
    setErrorMessage('');
    try {
      const completedTodo = todos.filter(todo => todo.completed);

      await Promise.all(completedTodo.map(todo => deleteTodo(todo.id)));

      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch {
      setErrorMessage(ErrorMessage.Delete);
    }
  };

  const visibleTodos = filterTodos(filter, todos);
  const todosLength = todos.filter(todo => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <section className="section container">
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <div className="todoapp__content">
          <TodoHeader
            onUpdateError={setErrorMessage}
            onSetNewTodoTitle={setNewTodoTitle}
            newTodoTitle={newTodoTitle}
            addTodo={addTodo}
            isLoading={isLoading}
            todos={todos}
          />
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList
              todos={visibleTodos}
              deleteTodo={deleteTodoFunc}
              todoTemp={todoTemp}
              todoId={todoId}
            />
          </section>
          {todos.length !== 0 && (
            <TodoFooter
              todoLength={todosLength}
              setFilter={setFilter}
              filterType={filter}
              deleteCompletedTodos={deleteCompletedTodo}
              todos={todos}
            />
          )}
        </div>
        <TodoErrors errors={errorMessage} onUpdateError={setErrorMessage} />
      </div>
    </section>
  );
};
