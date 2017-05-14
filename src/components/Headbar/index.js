import React from 'react'
import { connect } from 'react-redux'
import { toggleSidebar } from '../../actions'
import { NavLink } from 'react-router-dom'
import Searchbar from './Searchbar'
import { me } from '../../data'
import classnames from 'classnames'

let Headbar = ({
  toggleSidebar,
  sidebarHidden,
}) => {
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
        to={`/${me.id}`}
        className='Headbar__myTask'
        activeClassName='Headbar__myTask--active'
      >My Tasks:</NavLink>
      <Searchbar />
    </div>
  )
}

const mapStateToProps = (state) => ({
  sidebarHidden: state.sidebarHidden,
})

Headbar = connect(mapStateToProps, { toggleSidebar })(Headbar)


export default Headbar
