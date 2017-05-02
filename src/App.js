import React from 'react'
import { withRouter } from 'react-router'
import { Route,Switch,Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
// import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Headbar from './components/Headbar'
import MainContent from './components/MainContent'
import { me } from './data'
import './App.css'
// import { fetchTasks } from './api/fetchData'

//使用nested route的风格重写了，更清晰。这里使用match.path是精髓。之后react-roouter会出relative routes，能更方便地解决。

let Search = ({ match }) => {
  return (
    <Switch>
      <Route exact path={match.path} component={MainContent} />
      <Route exact path={`${match.path}/:taskId`} component={MainContent} />
      <Redirect to={`${match.url}`} />
    </Switch>
  )
}


let Project = ({ match,allProjectIds }) => {
  const projectId = match.params.id
  if(allProjectIds.indexOf(projectId) === -1 && projectId !== me.id){  //如果projectId不存在
    // return <Redirect to={`/${me.id}`}></Redirect>
  }
  return (
    <Switch>
      <Route exact path={match.path} component={MainContent} />
      <Route exact path={`${match.path}/:taskId`} component={MainContent} />
      <Redirect to={match.url} />
    </Switch>
  )
}

Project = connect(
  ({ projects }) => ({allProjectIds:projects.allIds})
)(Project)

class App extends React.Component {

  render(){
    return (
      <div className='App'>
        <Route component={Sidebar} />
        <div className='AppContent'>
          <Route component={Headbar} />
          <Switch>
            <Route path='/search/:searchId' component={Search} />
            <Route path='/:id' component={Project} />

            {/* <Route exact path='/search/:searchId/list' component={MainContent} />
            <Route exact path='/search/:searchId/:taskId' component={MainContent} />
            <Route exact path='/:id/list' component={MainContent} />
            <Route exact path='/:id/:taskId' component={MainContent} /> */}
            <Redirect to={`/${me.id}`}></Redirect>
          </Switch>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({
  tasks
}) => ({
  allIds:tasks.allIds,
})

App = withRouter(connect(mapStateToProps)(App))

export default App
