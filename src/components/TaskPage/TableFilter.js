import React from 'react'
import { connect } from 'react-redux'
import Filter from '../parts/Filter'

class TableFilter extends React.Component {

  getNewFilterArray = () => {
    const { filterArray,currentProject,currentUser } = this.props

    return filterArray.map(({ name,filter }) => {
      switch (currentProject) {
        case 'me':
        return ({
          name,
          filter:{
            ...filter,
            tasks:{...filter.tasks,assignee:currentUser},
          }
        })
        default:
        return ({
          name,
          filter:{
            ...filter,
            tasks:{...filter.tasks,projectId:currentProject},
          }
        })
      }
    })
  }

  render() {
    return (
      <Filter filterArray={this.getNewFilterArray()}/>
    )
  }
}

const mapStateToProps = ({ currentProject,currentUser }) => ({ currentProject,currentUser })

TableFilter = connect(mapStateToProps)(TableFilter)

export default TableFilter
