import React from 'react'

const Todo = ({
  id,
  text,
  completed,
  onClick
}) => (
  <li
    onClick = {onClick}
    style={{
      textDecoration:
        completed ?
          'line-through' :
          'none'
    }}
  >
    {id}. {text}
  </li>
)

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {
      todos.map(todo =>
      <Todo
        key = {todo.id}
        {...todo}
        onClick = {() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)

export default TodoList
