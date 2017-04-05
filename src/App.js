import React from 'react'
import { withRouter } from 'react-router'
import { Route,NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import Login from './components/Login/index'
import Sidebar from './components/Sidebar/index'
import Headbar from './components/Headbar/index'
import TaskPage from './components/TaskPage/index'
import DetailPage from './components/DetailPage/index'
import './App.css'
// import { fetchTasks } from './api/fetchData'

class App extends React.Component {

  render(){
    const {
      filteredTasks,
      currentTask,
      currentUser,
      location,
    } = this.props

    return (
      currentUser.qq === '0'?<Login />:
      (
          <div className='App'>
            <Route component={Sidebar} />
            <div className='AppContent'>
              <Headbar />
              <div className='MainContent'>
                <TaskPage />
                {
                  currentTask === '0'?null:
                  <DetailPage />
                }
              </div>
            </div>
          </div>
      )
    )
  }
}

const mapStateToProps = ({
  tasks,
  currentTask,
  currentUser,
}) => ({
  filteredTasks:tasks.allIds,
  currentTask,
  currentUser,
})

App = withRouter(connect(mapStateToProps)(App))

export default App
