import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { getProjectById, getAlltasks } from 'reducers'

class ProjectReport extends React.Component {
  render() {
    const { project = {}, progress, amount } = this.props
    // console.log(project, tasks, progress, amount, match.params)
    return (
      <div
        className="ml3 h-50 w-30 pa3 bg-white shadow-1"
        data-component="project-report"
      >
        <h2 className="black-50">{project.title}</h2>
        <div className="w-100 flex pa3">
          <span className="w3 h2">进度：</span>
          <div className="relative h2 w-100 bg-light-gray">
            <div
              className="absolute top-0 left-0 h-100 bg-cyan tc lh-copy"
              style={{ width: `${progress / 100 * 87 + 13}%` }}
            >
              {Math.floor(progress)} %
            </div>
          </div>

        </div>

        <div className="w-100 pa3">
          <span className="w3 h2">工作量：</span>{amount} 人天
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, { match }) => {
  const currentProject = match.params.id
  const project = getProjectById(state, currentProject)
  const tasks = getAlltasks(state).filter(t => !t.upTaskId && t.projectId)
  const amount = tasks.map(t => t.amount || 1).reduce((t1, t2) => t1 + t2, 0)
  const getProgress = task =>
    task.completed === 'completed' ? 100 : task.progress || 0
  const weightedAmount = tasks
    .map(t => getProgress(t) * t.amount || 0)
    .reduce((t1, t2) => t1 + t2, 0)
  const progress = tasks.length > 0 ? weightedAmount / amount : 0
  return {
    project,
    amount,
    progress
  }
}

const ConnectedProjectReport = withRouter(
  connect(mapStateToProps)(ProjectReport)
)

export default ConnectedProjectReport
