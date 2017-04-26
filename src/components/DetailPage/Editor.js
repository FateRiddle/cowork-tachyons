import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { editTaskTitle } from '../../actions'
import AutoResizingTextarea from '../parts/AutoResizingTextarea'
import Drop from '../parts/Drop'
import { getAllProjects } from '../../reducers'
import { editTaskProject } from  '../../actions'
import { isEmpty } from 'lodash'

class Editor extends React.Component {

  canEdit = () => {
    const { completed,search } = this.props
    return completed === 'active' && isEmpty(search)
  }

  changeProject = (projectId) => {
    const taskId = this.props.task.id
    this.props.editTaskProject(projectId,taskId)
  }

  render() {
    const { currentTask,task,allProjects,
      editTaskTitle,
    } = this.props
    const { title,projectId } = task || ''
    let projectArray = allProjects.map( project => ({name:project.title,id:project.id}) )
    projectArray = [...projectArray, {name:'No Project',id:''}]
    // console.log(projectArray);
    return (
      <div className='Editor'>
        <Drop
          titleId={projectId || ''}
          dropArray={projectArray}
          changeTitle={this.changeProject}
        />
        <input className='Editor__title'
          value={title||''}
          placeholder='标题'
          onChange={e => this.canEdit() && editTaskTitle(e.target.value,currentTask)}
        />

        <AutoResizingTextarea
          className="Editor__detail"
          lineHeight={18}
          placeholder="描述"
        />
      </div>
    )
  }
}

const mapStateToProps = (state,{ match }) => {
  const { tasks } = state
  const allProjects = getAllProjects(state)
  const currentTask = match.params.taskId
  const task = tasks.byId[currentTask]
  return {
    allProjects,
    task,
    currentTask,
    completed: state.completed,
    search: state.search,
  }
}

Editor = withRouter(
  connect(mapStateToProps,
  {editTaskTitle,editTaskProject}
)(Editor)
)

export default Editor
