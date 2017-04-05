import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SingleDatePicker } from 'react-dates'
import moment from 'moment'
import 'react-dates/lib/css/_datepicker.css'
import { editTaskDueDate } from '../../../actions'

class DueDateTab extends Component {

  state = {
    date:null,
    focused: false,
  }

  componentDidMount() {
    moment.locale('zh-cn')
  }

  componentDidUpdate(prevProps, prevState) {
    const { tasks,currentTask } = this.props
    if(currentTask !== prevProps.currentTask){
      const dueDate = tasks.byId[currentTask].dueDate
      this.setState({date:dueDate})
    }
  }

  handleDateChange(date){
    const { currentTask,editTaskDueDate } = this.props
    this.setState({date})
    editTaskDueDate(date,currentTask)
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

const mapStateToProps = ({ currentTask,tasks }) => ({
  currentTask,
  tasks,
})

DueDateTab = connect(mapStateToProps,
  { editTaskDueDate },
)(DueDateTab)

export default DueDateTab;
