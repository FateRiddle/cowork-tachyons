import React from 'react'
import { connect } from 'react-redux'
import AddItemInput from '../parts/AddItemInput'
import { NavLink } from 'react-router-dom'
import { addProject } from '../../actions'

let Sidebar = ({
  projects,
  addProject,
}) => {
  return (
    <div className="Sidebar">
      <AddItemInput placeholder="new project" addItem={addProject} />
      <ul className='ProjectList'>
      {
        projects.allIds
        .map(id =>
          <li key={id}>
            <NavLink to={`/${id}/list`}
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
  projects: React.PropTypes.object.isRequired,
  addProject: React.PropTypes.func.isRequired,
}

const mapStateToProps = ({ projects }) => ({
  projects,
})

Sidebar = connect(
  mapStateToProps,
  {
    addProject,
  }
)(Sidebar)

export default Sidebar
