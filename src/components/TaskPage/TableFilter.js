import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { changeCompleted } from 'actions'
import { Dropdown } from 'semantic-ui-react'

const options = [
  { key: 1, value: 'active', text: '未完成' },
  { key: 2, value: 'completed', text: '完成' },
  { key: 3, value: 'all', text: '全部' }
]

class TableFilter extends React.Component {
  changeTitle = (e, data) => {
    this.props.changeCompleted(data.value)
  }

  render() {
    return (
      <Dropdown
        value={this.props.completed || 'active'}
        options={options}
        onChange={this.changeTitle}
      />
    )
  }
}

const mapStateToProps = ({ completed }) => ({ completed })

TableFilter = withRouter(
  connect(mapStateToProps, { changeCompleted })(TableFilter)
)

export default TableFilter
