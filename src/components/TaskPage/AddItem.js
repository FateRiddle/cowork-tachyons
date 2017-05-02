import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { isEmpty } from 'lodash'
import { addTask } from '../../actions'
import { getFilteredTasks } from '../../reducers'

class AddItem extends React.Component {

  isActive = () => {
    const { completed,search } =this.props
    return completed === 'active' && isEmpty(search)
  }

  AddTask = () => {

    const { addTask,match } = this.props
    if(this.isActive()){
      const currentProject = match.params.id
      addTask(currentProject)
      setTimeout(()=>this.focusLast(),0)
    }
  }

  focusLast = () => {
    const { tasks,history } = this.props
    const lastId = tasks[tasks.length-1].id
    history.push(`${lastId}`)
  }

  render(){
    const { tasks } = this.props
    let msg = ''
    if(this.isActive()){
      if (tasks.length === 0){
        msg = '点击添加新任务'
      } else if(tasks.length < 2){
        msg = '选择一行回车'
      }
    }

    return (
      <div className='AddItem' onClick={this.AddTask}>{msg}</div>
    )
  }
}

// AddItem.propTypes = {
//   focusLast: React.PropTypes.func.isRequired,
//   listLength: React.PropTypes.number.isRequired,
// }

const mapStateToProps = (state,{ match }) => {
  const { completed,search } = state
  return {
    tasks:getFilteredTasks(state,match.params.id),
    completed,search,
  }
}

AddItem = withRouter(
  connect(mapStateToProps,
    { addTask }
  )(AddItem)
)

export default AddItem
