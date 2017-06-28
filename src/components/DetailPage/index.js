import React from 'react'
import Toolbar from './Toolbar'
import Editor from './Editor'
import Stats from './Stats'

class DetailPage extends React.Component {
  render() {
    return (
      <div className="DetailPage">
        <Toolbar />
        <Editor />
        <Stats />
      </div>
    )
  }
}

export default DetailPage
