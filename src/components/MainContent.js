import React from 'react'
import { connect } from 'react-redux'
import TaskPage from './TaskPage'
import Report from './Report'
import DetailPage from './DetailPage'
import * as actions from 'actions'

class MainContent extends React.Component {
  render() {
    const { match } = this.props
    const { taskId } = match.params || ''
    return match.params.taskId === 'report'
      ? <Report />
      : <div
          className="w-100 vh-fit bg-pale-grey border-box flex justify-center"
          data-component="MainContent"
        >
          <TaskPage />
          {taskId && <DetailPage />}
        </div>
  }
}

const mapStateToProps = state => ({
  search: state.search
})

MainContent = connect(mapStateToProps, actions)(MainContent)

export default MainContent
