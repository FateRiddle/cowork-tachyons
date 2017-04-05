import React from 'react'
import { connect } from 'react-redux'
import { changeFilter } from '../../actions'

class Filter extends React.Component {

  render() {
    const { filterArray,changeFilter } = this.props
    return <ul className='Filter'>
      {
        filterArray.map(({ name,filter },index) => (
          <li key={index} onClick={()=>changeFilter(filter)}>
            {name}
          </li>)
        )
      }
    </ul>
  }
}

Filter.propTypes = {
  filterArray: React.PropTypes.array
}

Filter = connect(null, { changeFilter })(Filter)

export default Filter
