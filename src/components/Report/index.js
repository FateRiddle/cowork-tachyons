import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actions from 'actions'
import TaskReport from './TaskReport'
import PersonReport from './PersonReport'
import ProjectReport from './ProjectReport'

const Tabs = ({ tabs, tab, toggleTab }) =>
  <ul className="flex-none self-start h2 mb1 shadow-1 flex">
    {tabs.map(t =>
      <li
        key={t.value}
        className={`w5 h-100 flex-center black-50 hover-bg-light-gray pointer ${tab ===
          t.value
          ? 'bg-light-gray'
          : 'bg-white'}`}
        onClick={() => toggleTab(t.value)}
      >
        {t.name}
      </li>
    )}
  </ul>

class Report extends React.Component {
  state = { tab: 'task' }
  componentDidMount() {
    this.update()
  }

  componentWillReceiveProps(nextProps) {
    const url1 = this.props.match.params.taskId
    const url2 = nextProps.match.params.taskId
    if (url1 !== url2 && url2 === 'report') {
      this.update()
    }
  }

  update = () => {
    const { updateAllTasksByProject, searchTasks, match, search } = this.props
    const projectId = match.params.id
    if (projectId === 'search') {
      searchTasks(search)
    } else {
      updateAllTasksByProject(match.params.id)
    }
  }

  tabs = [{ value: 'task', name: '任务' }, { value: 'person', name: '个人' }]

  toggleTab = tab => {
    this.setState({ tab })
  }

  render() {
    const { tab } = this.state
    const { fetched, isSearch } = this.props
    return (
      <div
        className="flex w-100 vh-fit pt3 ph3 pb1 bg-pale-grey"
        data-component="Report"
      >
        <section className="flex flex-column w-70 h-100">
          {isSearch &&
            <Tabs tabs={this.tabs} tab={tab} toggleTab={this.toggleTab} />}
          {!fetched
            ? <div className="h-100 f4 pt3 ph3 bg-white shadow-1">
                没有任务
              </div>
            : tab === 'task' ? <TaskReport /> : <PersonReport />}
        </section>
        {isSearch
          ? null
          : fetched
            ? <ProjectReport />
            : <div className="ml3 h-50 w-30 pa3 bg-white shadow-1" />}

      </div>
    )
  }
}

const mapStateToProps = ({ search, tasks }, { match }) => ({
  search,
  isSearch: match.params.id === 'search',
  fetched: tasks.taskFetched
})

Report = withRouter(connect(mapStateToProps, actions)(Report))

export default Report
