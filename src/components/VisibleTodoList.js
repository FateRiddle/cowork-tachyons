import React from 'react'
import { connect } from 'react-redux'

import TodoList from './TodoList'
import * as actions from '../actions'
import { getVisibleTodos } from '../reducers'


class VisibleTodoList extends React.Component {
  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    if(this.props.filter !== prevProps.filter){
      this.fetchData()
    }
  }

  fetchData(){
    const { filter, fetchTodos } = this.props
    fetchTodos(filter)
  }

  render() {
    const { toggleTodo, ...rest } = this.props
    return (
      <TodoList
        onTodoClick = {toggleTodo}
        {...rest}
      />
    )
  }
}

const mapTodoStateToProps = (state, { params }) => {
  const filter = params.filter || 'all'
  return {
    todos: getVisibleTodos(state, filter),
    filter,
  }
}

VisibleTodoList = connect(
  mapTodoStateToProps,
  actions,
)(VisibleTodoList)

export default VisibleTodoList
