/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface TodoItemProps {
  todo: Todo;
  deleteTodo: (id: number) => void;
  todoId: number | null;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  deleteTodo,
  todoId,
  inputRef,
}) => {
  return (
    <div data-cy="Todo" className={cn('todo', todo.completed && 'completed')}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': todoId === todo.id })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
