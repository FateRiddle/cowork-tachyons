import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Filter from '../parts/Filter'
import { changeFilter,changeCompletedTab } from '../../actions'
import { completedTabs } from '../../data'

class TableFilter extends React.Component {

  changeTitle = (filter) => {
    this.props.changeFilter(filter)
    this.props.changeCompletedTab(filter.id)
  }

  render() {
    return (
      <Filter className='TableFilter'
        titleId={this.props.completedTab}
        filterArray={completedTabs}
        changeTitle={this.changeTitle}
      />
    )
  }
}

const mapStateToProps = ({ completedTab }) => ({ completedTab })

TableFilter = withRouter(
  connect(
    mapStateToProps,
    { changeFilter,changeCompletedTab },
  )(TableFilter)
)

export default TableFilter
