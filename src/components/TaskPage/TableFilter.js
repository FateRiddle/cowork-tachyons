import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { changeCompleted, toggleTaskpage } from 'actions'
import { Dropdown } from 'semantic-ui-react'

const options = [
  { key: 1, value: 'active', text: '未完成' },
  { key: 2, value: 'completed', text: '完成' },
  { key: 3, value: 'all', text: '全部' },
]

class TableFilter extends React.Component {
  onChange = (e, data) => {
    const { match, changeCompleted, history } = this.props
    changeCompleted(data.value)
    history.push(`/${match.params.id}`)
  }

  render() {
    return (
      <div className="bg-white w-100 shadow-1 pv2 ph3 mb1 flex justify-between">
        <Dropdown
          className=" black-50 hover-thin-blue"
          value={this.props.completed || 'active'}
          options={options}
          onChange={this.onChange}
        />
        <div className="black-40 hover-thin-blue b f2 pointer" onClick={this.props.toggleTaskpage}>
          {'<'}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ completed }) => ({ completed })

TableFilter = withRouter(connect(mapStateToProps, { changeCompleted, toggleTaskpage })(TableFilter))

export default TableFilter
