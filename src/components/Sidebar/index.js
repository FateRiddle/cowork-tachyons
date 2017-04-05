import React from 'react'
import { connect } from 'react-redux'
import AddItemInput from '../parts/AddItemInput'
import { NavLink } from 'react-router-dom'
import * as actions from '../../actions'

let Sidebar = ({
  projects,
  addProject,
  changeFilter,
  location,
}) => {
  console.log(location);
  return (
    <div className="Sidebar">
      <AddItemInput placeholder="new project" addItem={addProject} />
      <ul className='ProjectList'>
      {
        projects.allIds
        .map(id =>
          <li key={id}>
            <NavLink to={`/${id}/list`}
              onClick={()=>{changeFilter()}}
            >
              {projects.byId[id].title}
            </NavLink>
          </li>
        )
      }
      </ul>
    </div>
  )
}

Sidebar.propTypes = {

}

const mapStateToProps = ({ projects }) => ({
  projects,
})

// Sidebar = withRouter(Sidebar)

Sidebar = connect(
  mapStateToProps,
  {
    ...actions,
  }
)(Sidebar)

export default Sidebar
