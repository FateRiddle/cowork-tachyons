import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import * as actions from '../../actions'

class AddItem extends React.Component {

  AddTask = () => {
    const {
      currentUser,currentProject,
      addTaskForMe,addTaskForProject,
      focusLast,
    } = this.props
    if(currentProject === 'me'){
      addTaskForMe(currentUser)
    } else {
      addTaskForProject(currentProject)
    }
    setTimeout(()=>focusLast(),0)
  }

  render(){
    const num = this.props.howManyTasks
    console.log(num);
    let msg = ''
    if (num === 0){
      msg = '点击添加新任务'
    } else if(num < 2){
      msg = '选择一行回车'
    }
    return (
      <div className='AddItem' onClick={this.AddTask}>{msg}</div>
    )
  }
}

AddItem.propTypes = {
  focusLast: React.PropTypes.func.isRequired,
  howManyTasks: React.PropTypes.number.isRequired,
}

const mapStateToProps = ({ currentUser,currentProject,tasks }) => ({
  currentUser,currentProject,tasks,
})

AddItem = withRouter(
  connect(mapStateToProps,
    {...actions}
  )(AddItem)
)

export default AddItem
