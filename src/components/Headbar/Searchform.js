import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { searchTasks, changeCompleted, changeSearch } from 'actions'
import { getAllUsers, getAllProjects } from 'reducers'
import classnames from 'classnames'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ClickOutside from 'react-click-outside'
// import moment from 'moment'

class Searchform extends React.Component {
  state = {
    hidden: true,
    assigneeHidden: true,
    assigneeList: [],
    projectHidden: true,
    projectList: [],
    completed: 'active',
    beginAt: null,
    completedAt: null,
    isDateOpen: false, //DatePicker 的日历没有被看做popup的一部分，点击日期会trigger onClickOutside,所以加了这个state来修正
  }

  onClickOutside = () => {
    if (!this.state.isDateOpen) {
      this.setState({ hidden: true })
    }
  }

  toggleList = () => {
    this.setState({ hidden: !this.state.hidden })
  }

  clear = () => {
    this.setState({
      assigneeList: [],
      projectList: [],
      completed: 'active',
      beginAt: null,
      completedAt: null,
    })
  }

  showAssigneeList = () => {
    this.setState({ assigneeHidden: !this.state.assigneeHidden })
  }

  showProjectList = () => {
    this.setState({ projectHidden: !this.state.projectHidden })
  }

  toggleAssignee = id => {
    const { assigneeList: list } = this.state
    if (list.indexOf(id) === -1) {
      //如果不存在，添加；如果存在，去掉
      this.setState({ assigneeList: [...list, id] })
    } else {
      this.setState({ assigneeList: list.filter(_id => _id !== id) })
    }
  }

  toggleProject = id => {
    const { projectList: list } = this.state
    if (list.indexOf(id) === -1) {
      //如果不存在，添加；如果存在，去掉
      this.setState({ projectList: [...list, id] })
    } else {
      this.setState({ projectList: list.filter(_id => _id !== id) })
    }
  }

  onBeginAtChange = date => {
    this.setState({ beginAt: date })
  }

  onCompletedAtChange = date => {
    this.setState({ completedAt: date })
  }

  onDateOpen = () => {
    this.setState({ isDateOpen: true })
  }
  onDateClose = () => {
    this.setState({ isDateOpen: false })
  }

  onSubmit = () => {
    this.toggleList()
    const { assigneeList, projectList, completed, beginAt, completedAt } = this.state
    const { changeSearch, changeCompleted, searchTasks, history } = this.props
    const newSearch = {
      assignee: assigneeList,
      projectId: projectList,
      completed,
      beginAt: beginAt ? beginAt.format() : null,
      completedAt: completedAt ? completedAt.format() : null,
    }
    changeSearch(newSearch) //this is for persist state to localStorage so refresh browser will load the same query
    changeCompleted(completed)
    searchTasks(newSearch)
    history.push('/search')
  }

  render() {
    const {
      hidden,
      assigneeHidden,
      projectHidden,
      completed,
      assigneeList,
      projectList,
      beginAt,
      completedAt,
    } = this.state
    const { users, projects } = this.props
    return (
      <main className="relative" data-component="Searchbar">
        <ClickOutside onClickOutside={this.onClickOutside}>
          <div>
            <input
              className="ba b--black-30 mh6 w5 pa2 br-pill pointer outline-0 indent"
              placeholder="搜索"
              onClick={this.toggleList}
            />
            {!hidden &&
              <form
                className="absolute z-max mt3 ph4 pv4 w-100 ba b--black-30 shadow-1 bg-white br2"
                data-component="Searchform"
              >
                <section data-component="selection">
                  <div className="flex flex-wrap" data-component="assignee">
                    <span className="pv2 w3 tr black-50 border-box pr3">分配给</span>
                    <span
                      className="ph3 ba pv2 br2 b--black-30 pointer black-50 dim"
                      onClick={this.showAssigneeList}
                    >
                      +
                    </span>
                    <ul className="w-100 ph3 pv2 flex flex-wrap" data-component="userList">
                      {!assigneeHidden &&
                        users.map(user =>
                          <li
                            key={user.id}
                            className={classnames('pv1 ph2 ma1 ba br2 b--black-30 pointer', {
                              'cyan b--cyan bg-washed-cyan': assigneeList.indexOf(user.id) > -1,
                            })}
                            onClick={() => this.toggleAssignee(user.id)}
                          >
                            {user.name}
                          </li>
                        )}
                    </ul>
                  </div>
                  <div className="flex flex-wrap" data-component="project">
                    <span className="pv2 w3 tr black-50 border-box pr3">项目</span>
                    <span
                      className="ph3 ba pv2 br2 b--black-30 pointer black-50 dim"
                      onClick={this.showProjectList}
                    >
                      +
                    </span>
                    <ul className="w-100 ph3 pv2 flex flex-wrap" data-component="projectList">
                      {!projectHidden &&
                        projects.map(project =>
                          <li
                            key={project.id}
                            className={classnames('pv1 ph2 ma1 ba br2 b--black-30 pointer', {
                              'cyan b--cyan bg-washed-cyan': projectList.indexOf(project.id) > -1,
                            })}
                            onClick={() => this.toggleProject(project.id)}
                          >
                            {project.title}
                          </li>
                        )}
                    </ul>
                  </div>
                  <div className="flex mb3" data-component="completed">
                    <span className="pv2 w3 tr black-50 border-box pr3">完成</span>
                    {[
                      { name: '未完成', value: 'active' },
                      { name: '完成', value: 'completed' },
                      { name: '全部', value: 'all' },
                    ].map((item, index) =>
                      <div
                        key={index}
                        className={classnames('ba b--black-30 black-80 w-25 pv1 tc pointer', {
                          'b--cyan bg-washed-cyan cyan': completed === item.value,
                        })}
                        onClick={() => this.setState({ completed: item.value })}
                      >
                        {item.name}
                      </div>
                    )}
                  </div>
                  <div className="flex mb3" data-component="date:from-to">
                    <span className="pv2 w3 flex-none tr black-50 border-box pr3">从</span>
                    <DatePicker
                      className="pa2 ba br2 w45 b--black-30 pointer outline-0 black-50 hover-thin-blue"
                      selected={beginAt}
                      onChange={this.onBeginAtChange}
                      isClearable={true}
                      readOnly={true}
                      placeholderText="开始时间"
                      locale="zh-cn"
                      onFocus={this.onDateOpen}
                      onBlur={this.onDateClose}
                    />
                    <span className="pv2 tr black-50 border-box ph3">到</span>
                    <DatePicker
                      className="pa2 ba br2 w45 b--black-30 pointer outline-0 black-50 hover-thin-blue"
                      selected={completedAt}
                      onChange={this.onCompletedAtChange}
                      isClearable={true}
                      readOnly={true}
                      placeholderText="完成时间"
                      locale="zh-cn"
                      onFocus={this.onDateOpen}
                      onBlur={this.onDateClose}
                    />
                  </div>
                  {/* <div className="flex mb3" data-component="dueAt">
              <span className="pv2 w-20 tr black-50 border-box pr3">
                截至日
              </span>
              <DatePicker
                className="ph3 ba pv2 br2 b--black-30 pointer outline-0 black-50 hover-thin-blue"
                selected={dueAt}
                onChange={this.onDueAtChange}
                isClearable={true}
                placeholderText="点击选择"
                locale="zh-cn"
              />
            </div> */}

                  {/* <div className="flex flex-wrap" data-component="creator">
              <span className="pv2 w-20 tr black-50 border-box pr3">
                创建人
              </span>
              <span
                className="ph3 ba pv2 br2 b--black-30 pointer black-50 dim"
                onClick={this.showCreatedByList}
              >
                +
              </span>
              <ul
                className="w-100 ph3 pv2 flex flex-wrap"
                data-component="userList"
              >
                {!createdByHidden &&
                  users.map(user =>
                    <li
                      key={user.id}
                      className={classnames(
                        'pv1 ph2 ma1 ba br2 b--black-30',
                        {
                          'cyan b--cyan bg-washed-cyan':
                            createdByList.indexOf(user.id) > -1
                        }
                      )}
                      onClick={() => this.toggleCreatedBy(user.id)}
                    >
                      {user.name}
                    </li>
                  )}
              </ul>
            </div> */}
                </section>
                <section className="flex justify-end mr3 mt4" data-component="buttons">
                  <div
                    className="ph3 pv2 dim tracked f5 br2 ba b--cyan cyan pointer mr3"
                    onClick={this.toggleList}
                  >
                    取消
                  </div>
                  <div
                    className="ph3 pv2 dim tracked f5 br2 ba b--cyan cyan pointer mr3"
                    onClick={this.clear}
                  >
                    清除
                  </div>
                  <div
                    className="ph3 pv2 dim tracked f5 br2 b--cyan bg-cyan white pointer"
                    onClick={this.onSubmit}
                  >
                    搜索
                  </div>
                </section>
              </form>}
          </div>
        </ClickOutside>
      </main>
    )
  }
}

const mapStateToProps = state => ({
  users: getAllUsers(state),
  projects: getAllProjects(state),
})

Searchform = withRouter(
  connect(mapStateToProps, {
    searchTasks,
    changeCompleted,
    changeSearch,
  })(Searchform)
)

export default Searchform
