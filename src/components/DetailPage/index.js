import React from 'react'
import Toolbar from './Toolbar'
import Relations from './Relations'
import Editor from './Editor'
import Subtasks from './Subtasks'
import Stats from './Stats'

class DetailPage extends React.Component {
  render() {
    return (
      <div className="w-40 mb2 mt3 mr2 shadow-1 bg-white">
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
