import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { SingleDatePicker } from 'react-dates'
import moment from 'moment'
import 'react-dates/lib/css/_datepicker.css'
import { editTaskDue } from '../../../actions'

class DueDateTab extends Component {

  state = {
    date:null,
    focused: false,
  }

  componentDidMount() {
    moment.locale('zh-cn')
  }

  componentDidUpdate(prevProps, prevState) {
    // const { tasks,currentTask } = this.props
    // if(currentTask !== prevProps.currentTask){
    //   const dueAt = tasks.byId[currentTask].dueAt
    //   this.setState({date:dueAt})
    // }
  }

  handleDateChange(date){
    const { currentTask,editTaskDue } = this.props
    this.setState({date})
    editTaskDue(date,currentTask)
  }

  render() {
    return (
        <SingleDatePicker
          id="date"
          placeholder="截止日期"
          date={this.state.date}
          focused={this.state.focused}
          onDateChange={date => this.handleDateChange(date)}
          onFocusChange={({ focused }) => this.setState({focused})}
        />
    )
  }
}

const mapStateToProps = ({ tasks },{ match }) => {
  const currentTask = match.params.taskId
  return {
    tasks,
    currentTask,
  }
}

DueDateTab = withRouter(
  connect(mapStateToProps,
    { editTaskDue },
  )(DueDateTab)
)

export default DueDateTab;
