import React from 'react'
import Pop from '../Pop'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { getGroupUsers,getAllUsers } from '../../reducers'
import { isEmpty } from 'lodash'

class ProjectEditor extends React.Component {

  state = { alertText: '',userListHidden:true }

  addUser = (id) => {
    const projectId = this.props.project.id
    this.props.addUserToProject(id,projectId)
  }

  removeUser = (id) => {
    const projectId = this.props.project.id
    this.props.removeUserFromProject(id,projectId)
  }

  handleOKClick = () => {
    const { project,onClick,editProjectTitle,editProjectGroup,addProject } = this.props   //必须要
    const title = this.titleDOM.value
    if(title === ''){
      this.setState({alertText:'请填写项目名'})
      return
    }
    this.setState({alertText:'',userListHidden:true})

    if(isEmpty(project)){  //说明是添加的新项目
      addProject(title,project.group)
      onClick()
      return
    }

    editProjectTitle(this.titleDOM.value,project.id)
    editProjectGroup(this.state.group,project.id)
    onClick()
    return
  }

  children = () => {
    const { userListHidden } = this.state
    const { restOfUsers,groupUsers,project } = this.props
    return (
      <div className="ProjectEditor">
        <input placeholder="project name" defaultValue={project.title} ref={node=>this.titleDOM=node} />
        <div className="ProjectEditor__Alert">{this.state.alertText}</div>
        {
          userListHidden? <div onClick={()=>this.setState({userListHidden:false})}>user+</div>:
          <div onClick={()=>this.setState({userListHidden:true})}>fold</div>
        }

        <ul className="ProjectEditor__UserList">
          {
            !userListHidden &&
            restOfUsers.map(user => (
              <li key={user.id}>
                <span>{user.name}</span>
                <span onClick={() => this.addUser(user.id)}>+</span>
              </li>
            ))
          }
        </ul>
        <ul className="ProjectEditor__Group">
          {
            groupUsers.map(user => (
              <li key={user.id}>
                <span>{user.name}</span>
                <span onClick={() => this.removeUser(user.id)}>-</span>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }

  render() {
    const { hidden } = this.props
    return (
      <Pop
        hidden={hidden}
        onClick={this.handleOKClick}
        children={this.children()}
      />
    )
  }
}

ProjectEditor.PropTypes = {
  project: React.PropTypes.object.isRequired,
  hidden: React.PropTypes.bool.isRequired,
  onClick: React.PropTypes.func.isRequired,
}

const mapStateToProps = (state,{ project }) => {
  const group = project.group || [] //if project is empty when you wann create a new one
  const allUsers = getAllUsers(state)
  const restOfUsers = allUsers.filter(user => group.indexOf(user.id) === -1)
  return {
    restOfUsers,
    groupUsers: getGroupUsers(state,group)
  }
}

ProjectEditor = connect(mapStateToProps,{...actions})(ProjectEditor)

export default ProjectEditor
