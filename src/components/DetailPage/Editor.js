import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { editTaskTitle } from '../../actions'
import AutoResizingTextarea from '../parts/AutoResizingTextarea'
import Drop from '../parts/Drop'
import { getAllProjects,getTaskById,getProjectById } from '../../reducers'
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
    const { currentTask,task,allProjects,projectName,
      editTaskTitle,
    } = this.props
    let projectArray = allProjects.map( project => ({name:project.title,id:project.id}) )
    projectArray = [...projectArray, {name:'No Project',id:''}]
    // console.log(projectArray);
    return (
      <div className='Editor'>
        <Drop
          className="Drop__project"
          title={projectName || 'No project'}
          dropArray={projectArray}
          changeTitle={this.changeProject}
        />
        <input className='Editor__title'
          value={task.title||''}
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
  const allProjects = getAllProjects(state)
  const currentTask = match.params.taskId
  const task = getTaskById(state,currentTask) || {}
  const { title } = getProjectById(state,task.projectId) || {}
  return {
    allProjects,
    task,
    currentTask,
    projectName: title || 'No Project',
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
