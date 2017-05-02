import React from 'react'
// import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import AssigneeTab from './AssigneeTab'
import DueDateTab from './DueDateTab'

class Toolbar extends React.Component {

  close = () => {
    this.props.history.push('')
  }

  render(){

    return <div className='Toolbar'>
      <AssigneeTab />
      <DueDateTab />
      <div className='Toolbar__closeButton' onClick={this.close}>X</div>
    </div>
  }
}

Toolbar = withRouter(Toolbar)

export default Toolbar
