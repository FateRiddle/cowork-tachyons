// taskId taskName projectId contents createDate deadline creatorId isComplete completeDate
// taskId: id
// projectId: projectId
// taskName: title
// contents: detail
// createDate: createdAt
// creatorId: creator
// deadline: dueDate
// isComplete: completed
// completeDate: completedAt
import moment from 'moment'

const task = (state, action) => {
  switch (action.type) {
    case "ADD_TASK_FOR_PROJECT":
    case "INSERT_TASK_FOR_PROJECT":
      return {
        id: action.id,
        projectId: action.projectId,
        title:'',
        detail:'',
        createdAt: moment(),
        creator:'',
        assignee:'',
        completed: false,
      }
    case "ADD_TASK_FOR_ME":
    case "INSERT_TASK_FOR_ME":
      return {
        id: action.id,
        assignee: action.assignee,
        title:'',
        detail:'',
        projectId:'',
        completed: false,
      }
    case "EDIT_TASK_TITLE":
      if (state.id === action.id){
        return {
          ...state,
          title:action.title,
        }
      }
      return state
    case "EDIT_TASK_DETAIL":
      if (state.id === action.id){
        return {
          ...state,
          detail:action.detail,
        }
      }
      return state
    case "EDIT_TASK_ASSIGNEE":
      if (state.id === action.id){
        return {
          ...state,
          assignee:action.assignee,
        }
      }
      return state
    case "EDIT_TASK_DUEDATE":
      if (state.id === action.id){
        return {
          ...state,
          dueDate:action.dueDate,
        }
      }
      return state
    case "TOGGLE_TASK":
      if (state.id === action.id){
        return {
          ...state,
          completed:!state.completed,
        }
      }
      return state
    case "EDIT_TASK_PROJECT":
      if (state.id === action.id){
        return {
          ...state,
          projectId:action.projectId,
        }
      }
      return state

    default:
      return state
  }
}

export default task


// task: id title projectId ~sectionId ~createDate dueDate ~tag ~fromWhere ~fromWho ~creator completed ~completeDate [assignee]
//
// ADD_TASK_FOR_PROJECT ADD_TASK_FOR_ME EDIT_TASK_TITLE EDIT_TASK_DETAIL EDIT_TASK_ASSIGNEE EDIT_TASK_DUEDATE ADD_TASK_TAG EDIT_TASK_PROJECT EDIT_TASK_SECTION DELETE_TASK TOGGLE_TASK
