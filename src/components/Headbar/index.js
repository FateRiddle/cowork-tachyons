import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import Searchbar from './Searchbar'
import * as actions from '../../actions'

let Headbar = ({
  users,
  currentUser,
  changeFilter,
}) => {
  const { name,id } = users.byId[currentUser]
  return (
    <div className='Headbar' >
      <NavLink to={`/${id}/list`}
        onClick={()=>changeFilter()}
      >{`${name}'s tasks:`}</NavLink>
      <Searchbar />
    </div>
  )
}

Headbar.propTypes = {

}

const mapStateToProps = ({ users, currentUser }) => ({
  users,
  currentUser,
})

Headbar = withRouter(
  connect(mapStateToProps,{
    ...actions,
  })(Headbar)
)

export default Headbar
