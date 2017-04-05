import React from 'react'
import { connect } from 'react-redux'
import { changeCurrentTask } from '../../../actions'
import AssigneeTab from './AssigneeTab'
import DueDateTab from './DueDateTab'

class Toolbar extends React.Component {

  close = () => {
    this.props.changeCurrentTask('0')
  }

  render(){

    return <div className='Toolbar'>
      <AssigneeTab />
      <DueDateTab />
      <button onClick={this.close}>X</button>
      {/* <div onClick={this.handleTagClick} >tag</div> */}
    </div>
  }
}

// Toolbar.propTypes = {
//   assignee: React.PropTypes.string,
//   toggleTag: React.PropTypes.func,
// }
//


Toolbar = connect(null,{ changeCurrentTask })(Toolbar)

export default Toolbar
