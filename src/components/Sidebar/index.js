import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { getAllProjects } from 'reducers'
import { addProject, toggleSidebar, updateProjectTasks } from 'actions'
import ProjectEditor from '../Pop/ProjectEditor'
import { Dropdown, Confirm } from 'semantic-ui-react'

class Sidebar extends React.Component {
  state = {
    // dropHidden:true,popHidden:true,
    confirmHidden: true,
    editorHidden: true,
    projectId: '' //which project to pass into ProjectEditor
  }

  handleAddProjectClick = () => {
    this.openProjectEditor()
  }

  modifyProject = projectId => {
    this.openProjectEditor(projectId)
  }

  deleteProject = projectId => {}

  onProjectClick = id => {
    this.props.updateProjectTasks(id)
  }

  openProjectEditor = (projectId = '') => {
    if (this.state.editorHidden) {
      this.setState({ editorHidden: false, projectId })
    }
  }

  render() {
    const { confirmHidden, editorHidden, projectId } = this.state
    const { projects, toggleSidebar, sidebarHidden } = this.props
    const project = projects.find(project => project.id === projectId) || {}
    return (
      <div
        className={classnames('Sidebar', { 'Sidebar--hidden': sidebarHidden })}
      >
        <div className="Sidebar__closeButton" onClick={toggleSidebar}>X</div>
        <ProjectEditor
          project={project}
          closeWindow={() => this.setState({ editorHidden: true })}
          hidden={editorHidden}
        />
        {/* <Confirm
          open={!confirmHidden}
          onCancel={this.handlePopCancel}
          onConfirm={this.handlePopConfirm}
        /> */}
        <div className="Sidebar__addProject">
          project
          <span
            className="addIcon Sidebar__headerAddIcon"
            onClick={this.handleAddProjectClick}
          >
            +
          </span>
        </div>

        <ul className="Sidebar__projectList">
          {projects.map(project =>
            <li key={project.id}>
              <NavLink
                to={`/${project.id}`}
                onClick={() => this.onProjectClick(project.id)}
              >
                {project.title}
              </NavLink>
              {/* <span className='addIcon'
                onClick={()=>{
                  this.openProjectEditor(project.id)
                }}
              >...</span> */}
              <Dropdown text="..." inline icon={null} pointing="left">
                <Dropdown.Menu>
                  <Dropdown.Item
                    text="modify"
                    onClick={() => this.modifyProject(project.id)}
                  />
                  <Dropdown.Item
                    text="delete"
                    onClick={() => this.deleteProject(project.id)}
                  />
                </Dropdown.Menu>
              </Dropdown>
            </li>
          )}
        </ul>

      </div>
    )
  }
}

Sidebar.propTypes = {
  projects: React.PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  projects: getAllProjects(state),
  sidebarHidden: state.sidebarHidden
})

Sidebar = connect(mapStateToProps, {
  addProject,
  toggleSidebar,
  updateProjectTasks
})(Sidebar)

export default Sidebar
