/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoMain } from './components/Main/TodoMain';
import { TodoFooter } from './components/Footer/TodoFooter';
import { TodoHeader } from './components/Header/TodoHeader';
import { TodoErrors } from './components/Errors/TodoErrors';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

export enum ErrorMessage {
  Update = 'Unable to update a todo',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Get = 'Unable to load todos',
  Title = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('All');

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

  const vievedTodos = filterTodos(filter, todos);
  const todosLength = todos.filter(todo => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <section className="section container">
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <div className="todoapp__content">
          <TodoHeader />
          <section className="todoapp__main" data-cy="TodoList">
            {vievedTodos.map(todo => (
              <TodoMain todo={todo} key={todo.id} />
            ))}
          </section>
          {todos.length !== 0 && (
            <TodoFooter
              todoLength={todosLength}
              setFilter={setFilter}
              filter={filter}
            />
          )}
        </div>
        <TodoErrors errors={errorMessage} onUpdateError={setErrorMessage} />
      </div>
    </section>
  );
};
