import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import * as actions from '../../actions'

class AddItem extends React.Component {

  AddTask = () => {
    const {
      addTask,
      focusLast,
      match,
    } = this.props
    const currentProject = match.params.id
    addTask(currentProject)
    setTimeout(()=>focusLast(),0)
  }

  render(){
    const { listLength } = this.props
    // console.log(num);
    let msg = ''
    if (listLength === 0){
      msg = '点击添加新任务'
    } else if(listLength < 2){
      msg = '选择一行回车'
    }
    return (
      <div className='AddItem' onClick={this.AddTask}>{msg}</div>
    )
  }
}

AddItem.propTypes = {
  focusLast: React.PropTypes.func.isRequired,
  listLength: React.PropTypes.number.isRequired,
}

const mapStateToProps = ({ tasks }) => ({
  tasks,
})

AddItem = withRouter(
  connect(mapStateToProps,
    {...actions}
  )(AddItem)
)

export default AddItem
