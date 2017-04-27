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

class App extends React.Component {

  render(){
    return (
      <div className='App'>
        <Route component={Sidebar} />
        <div className='AppContent'>
          <Route component={Headbar} />
          <Switch>
            <Route exact path='/search/:searchId/list' component={MainContent} />
            <Route exact path='/search/:searchId/:taskId' component={MainContent} />
            <Route exact path='/:id/list' component={MainContent} />
            <Route exact path='/:id/:taskId' component={MainContent} />
            <Redirect to={`/${me.id}/list`}></Redirect>
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
