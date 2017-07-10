import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { editTaskProject } from 'actions'
import { getAllProjects, getTaskById, getProjectById } from 'reducers'
import TaskStack from './TaskStack'

class Relations extends React.Component {
  render() {
    const { currentProject, currentTask } = this.props
    console.log(currentTask)
    return (
      <div>
        <Dropdown
          // className="Drop__project"
          value={currentProject}
          options={this.getProjectOptions()}
          onChange={this.changeProject}
        />
        <TaskStack id={currentTask} />
      </div>
    )
  }

  changeProject = (e, data) => {
    const projectId = data.value
    const { editTaskProject, currentTask } = this.props
    this.props.editTaskProject(projectId, currentTask)
  }

  getProjectOptions = () => {
    const { allProjects } = this.props
    const projectArray = allProjects.map(project => ({
      key: project.id,
      value: project.id,
      text: project.title
    }))
    return [...projectArray, { key: 0, value: '0', text: 'No Project' }]
  }
}

const mapStateToProps = (state, { match }) => {
  const allProjects = getAllProjects(state)
  const currentTask = match.params.taskId
  const task = getTaskById(state, currentTask) || {}
  const project = getProjectById(state, task.projectId) || {}
  const currentProject = project.id ? project.id : '0'
  return {
    allProjects,
    task,
    currentTask,
    currentProject
  }
}

Relations = withRouter(connect(mapStateToProps, { editTaskProject })(Relations))

export default Relations
