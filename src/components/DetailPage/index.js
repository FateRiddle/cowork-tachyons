import React from 'react'
import Toolbar from './Toolbar'
import Relations from './Relations'
import Editor from './Editor'
import Subtasks from './Subtasks'
import Stats from './Stats'

class DetailPage extends React.Component {
  render() {
    return (
      <div className="DetailPage">
        <Toolbar />
        <Relations />
        <Editor />
        <Subtasks />
        <Stats />
      </div>
    )
  }
}

export default DetailPage
