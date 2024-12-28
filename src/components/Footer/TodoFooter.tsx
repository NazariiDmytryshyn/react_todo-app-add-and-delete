import React from 'react';

interface TodoFilterProps {
  todoLength: number;
  setFilter: (filter: string) => void;
  filter: string;
}

export const TodoFooter: React.FC<TodoFilterProps> = ({
  todoLength,
  setFilter,
  filter,
}) => {
  return (
    // /* Hide the footer if there are no todos */
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todoLength} items left`}
      </span>

      {/* /* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === 'All' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === 'Active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilter('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === 'Completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter('Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
