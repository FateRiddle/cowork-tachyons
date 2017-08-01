import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { getTaskById } from 'reducers'
import { editTaskDetail, saveTaskDetail } from 'actions'

class Textarea extends React.Component {
  state = { rows: 2 }

  handleChange = e => {
    // To cause proper recalc when deleting lines
    const oldRows = e.target.rows
    e.target.rows = 2
    const newRows = ~~(e.target.scrollHeight / this.props.lineHeight)
    if (newRows === oldRows) {
      e.target.rows = newRows
    }
    this.setState({ rows: newRows })
    this.props.editTaskDetail(e.target.value, this.props.task.id)
  }

  handleBlur = e => {
    const detail = e.target.value
    const { task: { id }, saveTaskDetail } = this.props
    saveTaskDetail(detail, id)
  }

  render() {
    const { placeholder, className, lineHeight, task } = this.props
    // const { detail='' } = task || ''
    const detail = task.detail || ''

    return (
      <textarea
        placeholder={placeholder}
        className={className}
        value={detail}
        rows={this.state.rows}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        style={{ lineHeight: `${lineHeight}px` }}
      />
    )
  }
}

Textarea.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  lineHeight: PropTypes.number.isRequired
}

const mapStateToProps = (state, { match }) => {
  const currentTask = match.params.taskId
  const task = getTaskById(state, currentTask) || {}
  return {
    task
  }
}

Textarea = withRouter(
  connect(mapStateToProps, { editTaskDetail, saveTaskDetail })(Textarea)
)

export default Textarea
