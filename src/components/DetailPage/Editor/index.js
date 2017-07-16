import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { getTaskById } from 'reducers'
import {
  editTaskTitle,
  saveTaskTitle,
  editTaskDetail,
  saveTaskDetail
} from 'actions'
// import { Editor,Plain } from 'slate'
import 'draft-js/dist/Draft.css'

//使用draft-js暂时代替slate，slate的中文输入有bug
import { Editor, EditorState, ContentState } from 'draft-js'

const Plain = {
  deserialize: text =>
    EditorState.createWithContent(ContentState.createFromText(text)),

  serialize: state => state.getCurrentContent().getPlainText()
}
////////////////////////////////////////

class ContentEditor extends React.Component {
  state = {
    titleState: Plain.deserialize(''),
    detailState: Plain.deserialize('')
  } //for slate to work

  componentDidMount() {
    const { task } = this.props
    if (task.id) {
      this.setState({
        titleState: Plain.deserialize(task.title || ''),
        detailState: Plain.deserialize(task.detail || '')
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { task } = this.props
    const { task: nextTask } = nextProps
    if (
      nextTask.id &&
      nextTask.title !== task.title &&
      document.activeElement.type === 'text'
    ) {
      //当taskTable里修改title时，要同步
      this.setState({
        titleState: Plain.deserialize(nextTask.title || '')
      })
    }
    if (nextTask.id && nextTask.id !== task.id) {
      //只有当换task的时候才同步
      this.setState({
        titleState: Plain.deserialize(nextTask.title || ''),
        detailState: Plain.deserialize(nextTask.detail || '')
      })
    }
  }

  render() {
    return (
      <div className="ph3 pv2" data-component="Editor">
        <div className="f3 w-90 pa2 ba b--white hover-b mb3">
          <Editor
            placeholder="标题"
            editorState={this.state.titleState}
            onChange={this.onTitleChange}
            // onDocumentChange={this.handleTitleChange}
            onBlur={this.handleTitleBlur}
          />
        </div>
        <div className="w-90 pa2 ba b--white hover-b min-h-text">
          <Editor
            placeholder="内容"
            editorState={this.state.detailState}
            onChange={this.onDetailChange}
            // onDocumentChange={this.handleDetailChange}
            onBlur={this.handleDetailBlur}
          />
        </div>
      </div>
    )
  }

  canEdit = () => {
    //某些情况不允许编辑
    const { completed, match } = this.props
    return completed === 'active' && match.params.id !== 'search'
  }

  onTitleChange = state => {
    //this is for slate.js to work
    const title = Plain.serialize(state)
    const { editTaskTitle, currentTask } = this.props
    if (this.canEdit()) {
      this.setState({ titleState: state })
      editTaskTitle(title, currentTask)
    }
  }

  // handleTitleChange = (document,state) => { //this is for redux state in sync
  //   const title = Plain.serialize(state)
  //   const { editTaskTitle,currentTask } = this.props
  //   if(this.canEdit()){
  //     editTaskTitle(title,currentTask)
  //   }
  // }

  handleTitleBlur = () => {
    const title = Plain.serialize(this.state.titleState)
    const { currentTask, saveTaskTitle } = this.props
    saveTaskTitle(title, currentTask)
  }

  onDetailChange = state => {
    //this is for slate.js to work
    const detail = Plain.serialize(state)
    const { editTaskDetail, currentTask } = this.props
    if (this.canEdit()) {
      this.setState({ detailState: state })
      editTaskDetail(detail, currentTask)
    }
  }

  // handleDetailChange = (document,state) => { //this is for redux state in sync
  //   const detail = Plain.serialize(state)
  //   const { editTaskDetail,currentTask } = this.props
  //   if(this.canEdit()){
  //     editTaskDetail(detail,currentTask)
  //   }
  // }

  handleDetailBlur = () => {
    const detail = Plain.serialize(this.state.detailState)
    const { currentTask, saveTaskDetail } = this.props
    saveTaskDetail(detail, currentTask)
  }
}

const mapStateToProps = (state, { match }) => {
  const currentTask = match.params.taskId
  const task = getTaskById(state, currentTask) || {}
  return {
    task,
    currentTask,
    completed: state.completed,
    search: state.search
  }
}

ContentEditor = withRouter(
  connect(mapStateToProps, {
    editTaskTitle,
    saveTaskTitle,
    editTaskDetail,
    saveTaskDetail
  })(ContentEditor)
)

export default ContentEditor
