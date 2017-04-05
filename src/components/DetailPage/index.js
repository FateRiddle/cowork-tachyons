import React from 'react'
import { connect } from 'react-redux'
import { editTaskTitle } from '../../actions'
import Toolbar from './Toolbar/index'
import AutoResizingTextarea from '../parts/AutoResizingTextarea'

class DetailPage extends React.Component {

  render(){
    const { currentTask,tasks,
      editTaskTitle,
    } = this.props
    const { title } = tasks.byId[currentTask]
    return (
      <div className='DetailPage'>
        <Toolbar />
        <input className='DetailPageTitle'
          value={title||''}
          placeholder='标题'
          onChange={e => editTaskTitle(e.target.value,currentTask)}
        />
        {/* <AutoResizingTexterea /> */}

        <AutoResizingTextarea
          className="DetailPageDetail"
          lineHeight={18}
          placeholder="描述"
        />,
      </div>
    )
  }
}

DetailPage.propTypes = {

}

const mapStateToProps = ({ tasks,projects,currentTask }) => ({
  tasks,projects,currentTask
})

DetailPage = connect(mapStateToProps,
{editTaskTitle}
)(DetailPage)

export default DetailPage
