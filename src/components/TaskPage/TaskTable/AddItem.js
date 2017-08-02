import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { addTask, changeCurrentTask } from 'actions'

class AddItem extends React.Component {
  canEdit = () => {
    const { completed, match } = this.props
    return completed === 'active' && match.params.id !== 'search'
  }

  onClick = () => {
    const { addTask, match, index } = this.props
    if (this.canEdit()) {
      const currentProject = match.params.id
      addTask(currentProject)
      setTimeout(() => this.props.focusLast(index), 0)
    }
  }

  render() {
    const { index, style, match } = this.props
    let msg = ''
    if (this.canEdit()) {
      if (index === 0) {
        msg = '点击添加新任务'
      } else if (index < 2) {
        msg = '选择一行回车'
      }
    } else if (match.params.id === 'search') {
      msg = '没有符合要求的结果。'
    }
    return (
      <li
        className={`list pa2 ${this.canEdit() ? 'pointer' : ''}`}
        data-component="AddItem"
        style={style}
        onClick={this.onClick}
      >
        {msg}
      </li>
    )
  }
}

// AddItem.propTypes = {
//   focusLast: PropTypes.func.isRequired,
//   listLength: PropTypes.number.isRequired,
// }

const mapStateToProps = ({ completed }) => ({ completed })

AddItem = withRouter(
  connect(mapStateToProps, { addTask, changeCurrentTask })(AddItem)
)

export default AddItem
