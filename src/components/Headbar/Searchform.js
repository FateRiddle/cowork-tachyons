import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { searchTasks,changeCompleted,changeSearch } from '../../actions'
import { getAllUsers,getAllProjects } from '../../reducers'
import classnames from 'classnames'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
// import moment from 'moment'

class Searchform extends React.Component {

  state = {
    hidden: true,
    assigneeHidden: true,
    assigneeList: [],
    projectHidden: true,
    projectList: [],
    completed: 'active',
    dueAt: null,
    createdByHidden: true,
    createdByList: [],
    createdAt: null,
  }

  // {
  //   assignee:me.id,
  //   createdBy:me.id,
  //   createdAt:'',
  //   dueAt:'',
  //   projectId:'',
  //   completed:'all',
  // }
  toggleList = () => {
    this.setState({ hidden:!this.state.hidden })
  }

  clear = () => {
    this.setState({
      assigneeList: [],
      projectList: [],
      completed: 'active',
      dueAt: null,
      createdByList: [],
      createdAt: null,
    })
  }

  showAssigneeList = () => {
    this.setState({ assigneeHidden:!this.state.assigneeHidden })
  }

  showProjectList = () => {
    this.setState({ projectHidden:!this.state.projectHidden })
  }

  showCreatedByList = () => {
    this.setState({ createdByHidden:!this.state.createdByHidden })
  }

  toggleAssignee = (id) => {
    const { assigneeList: list } = this.state
    if(list.indexOf(id) === -1){ //如果不存在，添加；如果存在，去掉
      this.setState({ assigneeList:[...list, id] })
    } else {
      this.setState({ assigneeList:list.filter(_id => _id !== id) })
    }
  }

  toggleProject = (id) => {
    const { projectList: list } = this.state
    if(list.indexOf(id) === -1){ //如果不存在，添加；如果存在，去掉
      this.setState({ projectList:[...list, id] })
    } else {
      this.setState({ projectList:list.filter(_id => _id !== id) })
    }
  }

  toggleCreatedBy = (id) => {
    const { createdByList: list } = this.state
    if(list.indexOf(id) === -1){ //如果不存在，添加；如果存在，去掉
      this.setState({ createdByList:[...list, id] })
    } else {
      this.setState({ createdByList:list.filter(_id => _id !== id) })
    }
  }

  onDueAtChange = (date) => {
    this.setState({ dueAt:date })
  }

  onCreatedAtChange = (date) => {
    this.setState({ createdAt:date })
  }

  onSubmit = () => {
    this.toggleList()
    const { assigneeList,createdByList,createdAt,dueAt,projectList,completed } = this.state
    console.log(this.state);
    const newSearch = {
      assignee:assigneeList,
      createdBy:createdByList,
      createdAt:createdAt?createdAt.format():null,
      dueAt:dueAt?dueAt.format():null,
      projectId:projectList,
      completed,
    }
    this.props.changeSearch(newSearch) //this is for persist state to localStorage so refresh browser will load the same query
    this.props.searchTasks(newSearch)
    this.props.changeCompleted(completed)
    this.props.history.push('/search')
  }

  render() {

    const {
      hidden,assigneeHidden,projectHidden,completed,createdByHidden,
      assigneeList,projectList,createdByList,dueAt,createdAt
    } = this.state
    const { users,projects } = this.props
    return <div className='Searchbar'>
      <span>search:</span>
      <input type='text' onClick={this.toggleList} />
      <div tabIndex='0' onBlur={()=>{this.setState({hidden:true})}}>
        {
        !hidden &&
        <form className="Drop__list Searchform">
          <div className="Searchform__selection">
            <div>
              <span>分配给：</span>
              <span onClick={this.showAssigneeList}>+</span>
              <ul className="userList">
              {
                !assigneeHidden &&
                users.map(user => <li key={user.id}
                  className={classnames({
                    chosen: assigneeList.indexOf(user.id) > -1
                  })}
                  onClick={() => this.toggleAssignee(user.id)}
                >{user.name}</li>)
              }
              </ul>
            </div>
            <div className="Searchform__selection">
              <span>项目:</span>
              <span onClick={this.showProjectList}>+</span>
              <ul className="userList">
              {
                !projectHidden &&
                projects.map(project => <li key={project.id}
                  className={classnames({
                    chosen: projectList.indexOf(project.id) > -1
                  })}
                  onClick={() => this.toggleProject(project.id)}
                >{project.title}</li>)
              }
              </ul>
            </div>
            <div className="Searchform__completed">
              <div>完成:</div>
              {
                [
                  {name:'未完成',value:'active'},
                  {name:'完成',value:'completed'},
                  {name:'全部',value:'all'},
                ].map((item,index) => <div key={index}
                  className={classnames({

                    chosen: completed === item.value
                  })}
                  onClick={()=>this.setState({completed:item.value})}>
                  {item.name}
                </div>)
              }
            </div>
            <div className="Searchform__time">截至日:
              <DatePicker
                selected={dueAt}
                onChange={this.onDueAtChange}
                isClearable={true}
                placeholderText="点击选择"
                locale='zh-cn'
              />
            </div>

            <div className="Searchform__selection">
              <span>创建人:</span>
              <span onClick={this.showCreatedByList}>+</span>
              <ul className="userList">
              {
                !createdByHidden &&
                users.map(user => <li key={user.id}
                  className={classnames({
                    chosen: createdByList.indexOf(user.id) > -1
                  })}
                  onClick={() => this.toggleCreatedBy(user.id)}
                >{user.name}</li>)
              }
              </ul>
            </div>

            <div className="Searchform__time">创建时间:
              <DatePicker
                selected={createdAt}
                onChange={this.onCreatedAtChange}
                isClearable={true}
                placeholderText="点击选择"
                locale='zh-cn'
              />
            </div>
          </div>
          <div className='Searchform__buttons'>
            <div className='btn-grey' onClick={this.toggleList}>取消</div>
            <div className='btn-grey' onClick={this.clear}>清除</div>
            <div className='btn-grey' onClick={this.onSubmit}>确定</div>
          </div>
        </form>
      }
      </div>
    </div>
  }
}

const mapStateToProps = (state) => ({
  users:getAllUsers(state),
  projects:getAllProjects(state)
})

Searchform = withRouter(
  connect(mapStateToProps, {
    searchTasks,changeCompleted,changeSearch
  })(Searchform)
)

export default Searchform
