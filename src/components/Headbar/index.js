import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import Searchbar from './Searchbar'
import { me } from '../../data'

let Headbar = ({
  users,
}) => {
  const { name,id } = users.byId[me.id]
  return (
    <div className='Headbar' >
      <NavLink to={`/${id}/list`}
      >{`${name}'s tasks:`}</NavLink>
      <Searchbar />
    </div>
  )
}

Headbar.propTypes = {
  users: React.PropTypes.object.isRequired,
}

const mapStateToProps = ({ users }) => ({
  users,
})

Headbar = withRouter(
  connect(mapStateToProps)(Headbar)
)

export default Headbar
