import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import moment from 'moment'
import 'moment/locale/zh-cn'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { editTaskDue } from 'actions'
import { getTaskById } from 'reducers'

class DueDateTab extends Component {
  handleDateChange = date => {
    const { task, editTaskDue } = this.props
    // console.log(task.dueAt,date,task.id);
    if (task) {
      editTaskDue(date, task.id)
    }
  }

  render() {
    const { task, disabled } = this.props
    const selectedDate = task && task.dueAt ? moment(task.dueAt) : null
    return (
      <DatePicker
        className={`ph3 ba pv2 w10rem br-pill b--black-30 outline-0 black-50 ${disabled
          ? ''
          : 'pointer hover-thin-blue'}`}
        selected={selectedDate}
        onChange={this.handleDateChange}
        readOnly={true}
        isClearable={true}
        placeholderText="截止日"
        locale="zh-cn"
        disabled={disabled}
      />
    )
  }
}

const mapStateToProps = (state, { match }) => {
  const currentTask = match.params.taskId
  return {
    task: getTaskById(state, currentTask),
  }
}

DueDateTab = withRouter(connect(mapStateToProps, { editTaskDue })(DueDateTab))

export default DueDateTab
