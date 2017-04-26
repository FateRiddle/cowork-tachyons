import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { getAllProjects } from '../../reducers'
import { addProject } from '../../actions'
import ProjectEditor from '../Pop/ProjectEditor'

class Sidebar extends React.Component {

  state = { editorHidden:true,projectId:'' } //which project to pass into ProjectEditor

  handleAddProjectClick = () => {
    this.openProjectEditor()
  }

  openProjectEditor = (projectId='') => {
    this.setState({ editorHidden:false,projectId })
  }

  render(){
    const { editorHidden,projectId } = this.state
    const { projects } = this.props
    const project = projects.find(project => project.id === projectId) || {}
    return (
      <div className="Sidebar">
        <ProjectEditor
          project={project}
          closeWindow={()=>this.setState({editorHidden:true})}
          hidden={editorHidden}
        />
        <div>project<span onClick={this.handleAddProjectClick}>++</span></div>
        <ul className='ProjectList'>
        {
          projects.map(project =>
            <li key={project.id}>
              <NavLink to={`/${project.id}/list`}>
                {project.title}
              </NavLink>
              <span
                onClick={()=>{
                  this.openProjectEditor(project.id)
                }}
              >++</span>
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

const mapStateToProps = (state) => ({ projects:getAllProjects(state) })

Sidebar = connect(
  mapStateToProps, { addProject }
)(Sidebar)

export default Sidebar
