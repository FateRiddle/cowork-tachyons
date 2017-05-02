import React from 'react'
import { connect } from 'react-redux'
import { toggleSidebar } from '../../actions'
import { NavLink } from 'react-router-dom'
import Searchbar from './Searchbar'
import { me } from '../../data'
import { getUserById } from '../../reducers'
import classnames from 'classnames'

let Headbar = ({
  user,
  toggleSidebar,
  sidebarHidden,
}) => {
  const { name,id } = user
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
        to={`/${id}`}
        className='Headbar__myTask'
        activeClassName='Headbar__myTask--active'
      >{`${name}'s tasks:`}</NavLink>
      <Searchbar />
    </div>
  )
}

Headbar.propTypes = {
  user: React.PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  user: getUserById(state,me.id),
  sidebarHidden: state.sidebarHidden,
})

Headbar = connect(mapStateToProps, { toggleSidebar })(Headbar)


export default Headbar
