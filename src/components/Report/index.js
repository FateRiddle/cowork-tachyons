import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import TaskReport from './TaskReport'
import ProjectReport from './ProjectReport'
import * as actions from 'actions'
import { getAlltasks } from 'reducers'

class Report extends React.Component {
  componentDidMount() {
    const { updateAllTasksByProject, match } = this.props
    updateAllTasksByProject(match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    const url1 = this.props.match.params.taskId
    const url2 = nextProps.match.params.taskId
    if (url1 !== url2 && url2 === 'report') {
      this.props.updateAllTasksByProject(this.props.match.params.id)
    }
  }

  render() {
    const { allIds, fetched } = this.props
    return (
      <div
        className="w-100 vh-fit pt3 ph3 pb1 bg-pale-grey flex justify-start"
        data-component="wrapper"
      >
        {allIds.length > 0
          ? <ul
              className="h-100 border-box pt3 ph3 w-70 bg-white shadow-1 overflow-y-auto"
              data-component="Report"
            >
              {fetched &&
                allIds.map((id, index) =>
                  <TaskReport key={index} taskId={id} gray={false} />
                )}
            </ul>
          : <div className="h-100 f4 border-box pt3 ph3 w-70 bg-white shadow-1">
              没有任务
            </div>}

        {fetched
          ? <ProjectReport />
          : <div className="ml3 h-50 w-30 pa3 bg-white shadow-1" />}

      </div>
    )
  }
}

const mapStateToProps = state => {
  const tasks = getAlltasks(state).filter(t => !t.upTaskId)
  return {
    allIds: tasks.map(t => t.id),
    fetched: state.tasks.taskFetched
  }
}

Report = withRouter(connect(mapStateToProps, actions)(Report))

export default Report
