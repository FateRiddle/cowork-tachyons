import React from 'react'
import TaskPage from './TaskPage'
import DetailPage from './DetailPage'

class MainContent extends React.Component {

  // redirect = () => {
  //   this.props.history.push(`/${me.id}/list`)
  // }
  //
  // componentWillMount() {
  //   //validate,写到想哭。好烦
  //   const { tasks,projects,match } = this.props
  //   const { taskId } = match.params //可能不存在
  //   const pId = match.params.id || 0
  //   // console.log(tasks.allIds,tId,pId);
  //   //tId和pId都有效，且pId/tId匹配
  //   if(!taskId){
  //     if(projects.allIds.indexOf(pId) === -1 && pId !== me.id){
  //       return this.redirect()
  //     }
  //   }
  //
  //   if(taskId){
  //     if(tasks.allIds.indexOf(taskId) === -1){
  //       return this.redirect()
  //     }
  //     if(pId === me.id && tasks.byId[taskId].assignee !== pId){
  //       return this.redirect()
  //     }
  //     if(projects.allIds.indexOf(pId) > -1 && tasks.byId[taskId].projectId !== pId){
  //       return this.redirect()
  //     }
  //   }
  // }

  render(){
    const { match } = this.props
    // console.log('MainContent match',match);
    const { taskId } = match.params || ''
    return (
      <div className='MainContent'>
        <TaskPage />
        {
          taskId && <DetailPage />
        }
      </div>
    )
  }
}

// MainContent.propTypes = {
//   tasks: React.PropTypes.object.isRequired,
//   projects: React.PropTypes.object.isRequired,
// }
//
// MainContent = connect(
//   ({ tasks,projects }) => ({ tasks,projects }),
// )(MainContent)

export default MainContent
