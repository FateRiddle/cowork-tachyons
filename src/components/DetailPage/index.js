import React from 'react'
import Toolbar from './Toolbar'
import Editor from './Editor'

class DetailPage extends React.Component {

  render(){
    return (
      <div className='DetailPage'>
        <Toolbar />
        <Editor />
      </div>
    )
  }
}

export default DetailPage
