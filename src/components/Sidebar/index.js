import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { getAllProjects } from 'reducers'
import * as actions from 'actions'
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
    this.props.changeCurrentTask()
  }

  openProjectEditor = (projectId = '') => {
    if (this.state.editorHidden) {
      this.setState({ editorHidden: false, projectId })
    }
  }

  render() {
    const { confirmHidden, editorHidden, projectId } = this.state
    const {
      projects,
      toggleSidebar,
      sidebarHidden,
      fetched,
      match
    } = this.props
    const project = projects.find(project => project.id === projectId) || {}
    return (
      <div
        className={classnames(
          'bg-deep-blue vh-100 w5 absolute relative-ns z-1 pt3',
          {
            dn: sidebarHidden
          }
        )}
      >
        <div
          className="absolute right-1 top-1 f4 white-60 pointer dim"
          data-component="closeBtn"
          onClick={toggleSidebar}
        >
          X
        </div>
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
        <div
          className="pl3 f3 tracked-mega h2 mr2 white-60"
          data-component="+Project"
        >
          项目
          <span
            className="light-blue br-100 ba dib pa1 dim pointer"
            onClick={this.handleAddProjectClick}
          >
            +
          </span>
        </div>
        {fetched &&
          <ul className="list mt3" data-component="projectList">
            {projects.map(p =>
              <li
                key={p.id}
                className={`pv2 pl3 flex hover-bg-thin-blue deep-blue hover-light-gray ${p.id ===
                  match.params.id
                  ? 'bg-deepest-blue'
                  : ''}`}
              >
                <NavLink
                  className="white-80 flex-grow hover-white-80 mw5"
                  to={`/${p.id}`}
                  onClick={() => this.onProjectClick(p.id)}
                >
                  {p.title}
                </NavLink>
                <Dropdown
                  className="ph3 tracked white-50 lh-solid"
                  text="..."
                  inline
                  icon={null}
                  pointing="left"
                >
                  <Dropdown.Menu>
                    <Dropdown.Item
                      text="修改"
                      onClick={() => this.modifyProject(p.id)}
                    />
                    <Dropdown.Item
                      text="删除"
                      onClick={() => this.deleteProject(p.id)}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            )}
          </ul>}
      </div>
    )
  }
}

Sidebar.propTypes = {
  projects: React.PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  projects: getAllProjects(state),
  fetched: state.projects.fetched,
  sidebarHidden: state.sidebarHidden
})

Sidebar = connect(mapStateToProps, actions)(Sidebar)

export default Sidebar

// addProject,
// toggleSidebar,
// updateProjectTasks,
// changeCurrentTask
