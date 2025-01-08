import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface TodoHeaderProps {
  onUpdateError: (error: string) => void;
  onSetNewTodoTitle: (title: string) => void;
  newTodoTitle: string;
  addTodo: (event: React.FormEvent<HTMLFormElement>, title: string) => void;
  isLoading: boolean;
  todos: Todo[];
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  onSetNewTodoTitle,
  newTodoTitle,
  addTodo,
  isLoading,
  todos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const todoTitle = event.target.value;

    onSetNewTodoTitle(todoTitle);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={event => addTodo(event, newTodoTitle)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={newTodoTitle}
          onChange={handleInput}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
