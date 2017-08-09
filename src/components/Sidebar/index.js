import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { getAllProjects } from 'reducers'
import * as actions from 'actions'
import ProjectEditor from '../Pop/ProjectEditor'
import DeletePop from './DeletePop'
import { Dropdown, Icon } from 'semantic-ui-react'

class Sidebar extends React.Component {
  state = {
    popHidden: true,
    editorHidden: true,
    projectId: '', //which project to pass into ProjectEditor/DeletePop
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

  onDeleteClick = projectId => {
    this.setState({ popHidden: false, projectId })
  }

  toggleDeletePop = () => {
    this.setState({ popHidden: !this.state.popHidden })
  }

  openProjectEditor = (projectId = '') => {
    if (this.state.editorHidden) {
      this.setState({ editorHidden: false, projectId })
    }
  }

  render() {
    const { editorHidden, popHidden, projectId } = this.state
    const { projects, toggleSidebar, sidebarHidden, fetched, match } = this.props
    const project = projects.find(project => project.id === projectId) || {}
    return (
      <div
        data-component="Sidebar"
        className={classnames('bg-deep-blue vh-100 w5 absolute relative-ns z-1 pt3', {
          dn: sidebarHidden,
        })}
      >
        <div
          className="absolute right-0 top-0 pt2 pr3 f4 white-60 pointer dim"
          data-component="closeBtn"
          onClick={toggleSidebar}
        >
          x
        </div>
        <ProjectEditor
          project={project}
          closeWindow={() => this.setState({ editorHidden: true })}
          hidden={editorHidden}
        />
        <DeletePop
          id={projectId}
          canDelete={project.hasTask ? false : true}
          hidden={popHidden}
          toggle={this.toggleDeletePop}
        />
        <div className="pl3 f3 tracked-mega h2 mr2 white-60" data-component="+Project">
          项目
          <Icon
            className="ph2 light-blue dim pointer"
            name="plus"
            onClick={this.handleAddProjectClick}
          />
        </div>
        {fetched &&
          <ul className="list mt3" data-component="projectList">
            {projects.map(p =>
              <li
                key={p.id}
                className={`pl3 flex hover-bg-thin-blue deep-blue hover-light-gray ${p.id ===
                match.params.id
                  ? 'bg-deepest-blue'
                  : ''}`}
              >
                <NavLink
                  className="pv2 white-80 flex-grow hover-white-80 mw5"
                  to={`/${p.id}`}
                  onClick={() => this.onProjectClick(p.id)}
                >
                  {p.title}
                </NavLink>
                <Dropdown
                  className="pv2 ph3 tracked white-50 lh-solid"
                  text="..."
                  inline
                  icon={null}
                  // pointing="left"
                >
                  <Dropdown.Menu>
                    <Dropdown.Item text="修改" onClick={() => this.modifyProject(p.id)} />
                    <Dropdown.Item text="删除" onClick={() => this.onDeleteClick(p.id)} />
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
  projects: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  projects: getAllProjects(state).filter(
    p => p.group.indexOf(state.me.id) > -1 || p.creator === state.me.id
  ),
  fetched: state.projects.fetched,
  sidebarHidden: state.visual.sidebarHidden,
})

Sidebar = connect(mapStateToProps, actions)(Sidebar)

export default Sidebar

// addProject,
// toggleSidebar,
// updateProjectTasks,
// changeCurrentTask
