import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { getAllProjects } from '../../reducers'
import { addProject,toggleSidebar } from '../../actions'
import ProjectEditor from '../Pop/ProjectEditor'
import classnames from 'classnames'

class Sidebar extends React.Component {

  state = { editorHidden:true,projectId:'' } //which project to pass into ProjectEditor

  handleAddProjectClick = () => {
    this.openProjectEditor()
  }

  openProjectEditor = (projectId='') => {
    if(this.state.editorHidden){
      this.setState({ editorHidden:false,projectId })
    }
  }

  isLinkActive = (match,location) => {
    if(match){
      return true
    }
    // if()
    return false
  }

  render(){
    const { editorHidden,projectId } = this.state
    const { projects,toggleSidebar,sidebarHidden } = this.props
    const project = projects.find(project => project.id === projectId) || {}
    return (
      <div className={
        classnames("Sidebar",{"Sidebar--hidden":sidebarHidden})
      }>
        <div className="Sidebar__closeButton"
          onClick={toggleSidebar}
        >X</div>
        <ProjectEditor
          project={project}
          closeWindow={()=>this.setState({editorHidden:true})}
          hidden={editorHidden}
        />
        <div className='Sidebar__addProject'>
          project
          <span className='addIcon Sidebar__headerAddIcon'
            onClick={this.handleAddProjectClick}>+</span>
        </div>
        <ul className='Sidebar__projectList'>
        {
          projects.map(project =>
            <li key={project.id}>
              <NavLink
                to={`/${project.id}`}
                isActive={this.isLinkActive}
              >
                {project.title}
              </NavLink>
              <span className='addIcon'
                onClick={()=>{
                  this.openProjectEditor(project.id)
                }}
              >+</span>
            </li>
          )
        }
        </ul>
      </div>
    )
  }
}

Sidebar.propTypes = {
  projects: React.PropTypes.array.isRequired,
}

const mapStateToProps = (state) => ({
  projects:getAllProjects(state),
  sidebarHidden: state.sidebarHidden,
})

Sidebar = connect(
  mapStateToProps, { addProject,toggleSidebar }
)(Sidebar)

export default Sidebar
