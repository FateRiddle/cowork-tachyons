import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Filter from '../parts/Filter'
import { me } from '../../data'
import { changeCompleted,changeSearch } from '../../actions'

const filterArray = [
  {id:1,name:'未完成',completed:'active'},
  {id:2,name:'全部',completed:'all'},
  {id:3,name:'完成',completed:'completed'},
]


class TableFilter extends React.Component {

  changeTitle = ({ completed,search }) => {
    const { changeCompleted,changeSearch } = this.props
    changeCompleted(completed)
    changeSearch(search)
  }

  render() {
    return (
      <Filter className='tableFilter'
        filterArray={filterArray}
        changeTitle={this.changeTitle}
      />
    )
  }
}

const mapStateToProps = (state) => ({state})

TableFilter = withRouter(
  connect(
    mapStateToProps,
    { changeCompleted,changeSearch },
  )(TableFilter)
)

export default TableFilter
