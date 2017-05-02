import React from 'react'
import Pop from '../Pop'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { getAllUsers } from '../../reducers'
import { isEmpty } from 'lodash'

class ProjectEditor extends React.Component {

  state = { alertText: '',userListHidden:true, group:[] }

  componentWillReceiveProps(nextProps) {
    if(this.props.hidden && !nextProps.hidden){
      this.setState({group:nextProps.project.group || []})
    }
  }

  addUser = (id) => {
    this.setState({
      group:[
        ...this.state.group,
        id
      ]
    })
  }

  removeUser = (id) => {
    this.setState({
      group:this.state.group.filter(userId => userId !== id)
    })
  }

  handleOKClick = () => {
    const { project,closeWindow,editProject,addProject } = this.props   //必须要
    const title = this.titleDOM.value
    if(title === ''){
      this.setState({alertText:'请填写项目名'})
      return
    }
    if(this.state.group.length === 0){
      this.setState({alertText:'項目組至少要有一人'})
      return
    }
    this.setState({alertText:'',userListHidden:true})

    if(isEmpty(project)){  //说明是添加的新项目
      addProject(title,this.state.group)
      closeWindow()
      return
    }

    editProject(this.titleDOM.value,this.state.group,project.id)
    closeWindow()
    return
  }

  handleCancelClick = () => {
    this.setState({alertText:'',userListHidden:true})
    this.props.closeWindow()
  }

  children = () => {
    const { userListHidden,group,alertText } = this.state
    const { allUsers,project } = this.props
    const groupUsers = allUsers.filter(u => group.indexOf(u.id) > -1)
    const restOfUsers = allUsers.filter(u => group.indexOf(u.id) === -1)
    return (
      <div className="ProjectEditor">
        <input placeholder="project name" defaultValue={project.title} ref={node=>this.titleDOM=node} />
        <div className="ProjectEditor__alert">{alertText}</div>
        <div className='ProjectEditor__label'
          onClick={()=>this.setState({userListHidden:!userListHidden})}>
          user
          <span className='addIcon'>{userListHidden?'+':'-'}</span>
        </div>
        {
          !userListHidden &&
          <ul className="ProjectEditor__userList">
            {
              !userListHidden &&
              restOfUsers.map(user => (
                <li key={user.id}>
                  <span onClick={() => this.addUser(user.id)}>{user.name}</span>
                </li>
              ))
            }
          </ul>
        }

        <div className='ProjectEditor__label'>group:</div>
        <ul className="ProjectEditor__userList">
          {
            groupUsers.map(user => (
              <li key={user.id}>
                <span onClick={() => this.removeUser(user.id)}>{user.name}</span>
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
        onOKClick={this.handleOKClick}
        onCancelClick={this.handleCancelClick}
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

const mapStateToProps = (state) => {
  // const group = project.group || [] //if project is empty when you wann create a new one
  const allUsers = getAllUsers(state)
  // const restOfUsers = allUsers.filter(user => group.indexOf(user.id) === -1)
  return {
    allUsers
  }
}

ProjectEditor = connect(mapStateToProps,{...actions})(ProjectEditor)

export default ProjectEditor
