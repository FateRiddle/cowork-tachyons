import React from 'react'
import { withRouter } from 'react-router'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
// import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Headbar from './components/Headbar'
import MainContent from './components/MainContent'
import { updateState } from './actions'
// import './App.css'
// import { fetchTasks } from './api/fetchData'

//使用nested route的风格重写了，更清晰。这里使用match.path是精髓。之后react-roouter会出relative routes，能更方便地解决。

let Project = ({ match, allProjectIds, me }) => {
  // const projectId = match.params.id
  // if (
  //   allProjectIds.indexOf(projectId) === -1 &&
  //   projectId !== me.id &&
  //   projectId !== 'search'
  // ) {
  //   //如果projectId不存在
  //   return <Redirect to={`/${me.id}`} />
  // }
  return (
    <Switch>
      <Route exact path={match.path} component={MainContent} />
      <Route exact path={`${match.path}/:taskId`} component={MainContent} />
      <Redirect to={match.url} />
    </Switch>
  )
}

Project = connect(({ projects, me }) => ({
  allProjectIds: projects.allIds,
  me
}))(Project)

class App extends React.Component {
  componentDidMount() {
    const { me } = this.props
    if (me) {
      // console.log(localStorage.getItem('token'))
      this.props.updateState() //only update uses and projects here. update tasks base on url & inside <MainContent />
    }
  }

  render() {
    const { me } = this.props
    return (
      <div className="flex">
        <Route
          path="/:id?/:taskId?"
          children={props => <Sidebar {...props} />}
        />
        <div className="flex flex-column w-100 vh-100">
          <Route
            path="/:id?/:taskId?"
            children={props => <Headbar {...props} />}
          />
          <Switch>
            <Route path="/:id" component={Project} />
            <Redirect to={`/${me.id}`} />
          </Switch>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ me, tasks }) => ({
  allIds: tasks.allIds,
  me
})

App = withRouter(connect(mapStateToProps, { updateState })(App))

export default App
