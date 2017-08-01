import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as actions from 'actions'
import { getTaskById, getUserById, getAlltasks, getProjectById } from 'reducers'
import moment from 'moment'

class Task extends React.Component {
  state = { fold: true }

  toggle = () => {
    this.setState({ fold: !this.state.fold })
  }

  render() {
    const { fold } = this.state
    const { task, projectName, user, subIds, gray } = this.props
    const userName = user ? user.name : ''
    //dueDate display
    const diff = task.dueAt && task.dueAt.diff(moment(), 'days', true)
    const isDue = diff < 0
    const closeToDue = diff < 1.5 && diff >= 0
    //calculate progress
    const getProgress = task =>
      task.completed === 'completed' ? 100 : task.progress || 0
    return (
      <li
        className={`relative ba b--black-10 mb2 ph3 pv2 ${gray
          ? 'bg-light-gray'
          : 'bg-white'}`}
      >
        <div
          className="absolute h-100 top-0 left-0 bg-cyan o-20"
          style={{ width: `${getProgress(task)}%` }}
          data-component="progressColor"
        />
        <main className="flex items-center flex-wrap">
          <section className="w-100 flex mb3" data-component="1st-line">
            {subIds.length > 0 &&
              <div
                className="f3 dim pointer w2 tracked z-1"
                data-component="toggle"
                onClick={this.toggle}
              >
                [{fold ? '+' : '-'}]
              </div>}
            <div className="pl2 flex-grow">
              {task.title}
            </div>
            <div
              data-component="dueAt"
              className={`pl2 ${closeToDue ? 'orange' : ''} ${isDue
                ? 'red'
                : ''}`}
            >
              {task.dueAt && task.dueAt.format().substring(5, 10)}
            </div>
            <div className="pl2">
              {userName}
            </div>
          </section>
          <section className="w-100 flex mb1" data-component="2nd-line">
            <div className="">
              <span className="black-60">工作量：</span>{task.amount || 1}天
            </div>
            <div className="pl2">
              <span className="black-60">进度：</span>
              {Math.floor(getProgress(task))}%
            </div>
            <div className="flex-auto tr">
              {projectName}
            </div>
          </section>
        </main>
        {!fold &&
          <ul>
            {subIds.map((id, index) =>
              <ConnectedTask key={index} taskId={id} gray={!gray} />
            )}
          </ul>}
      </li>
    )
  }
}

Task.propTypes = {
  taskId: PropTypes.string
}

const mapStateToProps = (state, { taskId }) => {
  const task = getTaskById(state, taskId)
  const subIds = getAlltasks(state)
    .filter(t => t.upTaskId && t.upTaskId === taskId)
    .map(t => t.id)
  const rootId = task.upTaskId ? task.rootTaskId : taskId
  const projectId = getTaskById(state, rootId).projectId
  const projectName = projectId ? getProjectById(state, projectId).title : ''
  return {
    projectName,
    subIds,
    task,
    user: getUserById(state, task.assignee)
  }
}

const ConnectedTask = connect(mapStateToProps, actions)(Task)

export default ConnectedTask
