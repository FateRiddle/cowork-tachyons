import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Person from './Person'

const Timeline = ({ begin, end }) =>
  <div className="ph4 w-100 flex-none h2 black-50" data-component="Timeline">
    {begin} 到 {end}
  </div>

class PersonReport extends React.Component {
  render() {
    const { fetched, assignees, begin, end } = this.props
    return (
      <section className="pv3 bg-white shadow-1 h-100 flex-auto">
        {fetched
          ? <div className="h-100 flex flex-column">
              <Timeline begin={begin} end={end} />
              <ul className="ph4 flex-auto overflow-y-auto">
                {assignees.map((a, index) => <Person key={index} id={a} />)}
              </ul>
            </div>
          : <div className="f4 pt3 ph3">
              没有内容
            </div>}
      </section>
    )
  }
}

const mapStateToProps = ({ search, tasks, projects, users }) => {
  const formatDate = date => {
    if (date) {
      return date.substring(0, 10)
    }
    return moment().format().substring(0, 10)
  }
  return {
    fetched: tasks.taskFetched && projects.fetched,
    assignees: search.assignee.length > 0 ? search.assignee : users.allIds,
    begin: search.beginAt ? formatDate(search.beginAt) : '很久以前',
    end: formatDate(search.completedAt)
  }
}

const ConnectedPersonReport = connect(mapStateToProps)(PersonReport)

export default ConnectedPersonReport
