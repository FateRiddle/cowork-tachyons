import React from 'react'
import { withRouter } from 'react-router'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Sidebar from './components/Sidebar'
import Headbar from './components/Headbar'
import MainContent from './components/MainContent'
import Warning from './components/Warning'
import { updateState } from 'actions'
// import './App.css'
// import { fetchTasks } from './api/fetchData'

//使用nested route的风格重写了，更清晰。这里使用match.path是精髓。之后react-roouter会出relative routes，能更方便地解决。
let Project = ({ match, allProjectIds, me }) => {
  if (
    match.params.id !== 'search' &&
    match.params.id !== me.id &&
    allProjectIds.indexOf(match.params.id) === -1
  ) {
    return <Redirect to={`/${me.id}`} />
  }
  return (
    <Switch>
      <Route exact path={`${match.path}/:taskId?`} component={MainContent} />
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
      //only update uses and projects here. update tasks base on url & inside <TaskPage /> && <Report />
      this.props.updateState()
    }
  }

  render() {
    const { me, fetched, warning } = this.props
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
          {fetched &&
            <Switch>
              <Route path="/:id" component={Project} />
              <Redirect to={`/${me.id}`} />
            </Switch>}
          {warning &&
            <Warning className="absolute bottom-0 left-0 ma3 pa3 white b bg-light-red w5 h3 flex-center z-2" />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ me, projects, warning }) => ({
  fetched: projects.fetched,
  me,
  warning: warning.main
})

App = withRouter(connect(mapStateToProps, { updateState })(App))

export default App
