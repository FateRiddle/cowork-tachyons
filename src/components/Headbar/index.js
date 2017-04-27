import React from 'react'
import { connect } from 'react-redux'
import { toggleSidebar } from '../../actions'
import { NavLink } from 'react-router-dom'
import Searchbar from './Searchbar'
import { me } from '../../data'
import classnames from 'classnames'

let Headbar = ({
  users,
  toggleSidebar,
  sidebarHidden,
}) => {
  const { name,id } = users.byId[me.id]
  return (
    <div className='Headbar' >
      <div
        className={
          classnames(
            "Headbar__openSidebar",
            {"Sidebar--hidden":!sidebarHidden}
          )
        }
        onClick={toggleSidebar}
      >三</div>
      <NavLink
        to={`/${id}/list`}
        className='Headbar__myTask'
        activeClassName='Headbar__myTask--active'
      >{`${name}'s tasks:`}</NavLink>
      <Searchbar />
    </div>
  )
}

Headbar.propTypes = {
  users: React.PropTypes.object.isRequired,
}

const mapStateToProps = ({ users,sidebarHidden }) => ({
  users,sidebarHidden,
})

Headbar = connect(mapStateToProps, { toggleSidebar })(Headbar)


export default Headbar
