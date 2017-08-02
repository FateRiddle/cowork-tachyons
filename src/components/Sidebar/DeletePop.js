import React from 'react'
import { connect } from 'react-redux'
import Pop from 'components/Pop'
import { deleteProject } from 'actions'

const DeletePop = ({ id, hidden, toggle, deleteProject }) => {
  const onOKClick = id => {
    deleteProject(id)
    toggle()
  }
  return (
    <Pop hidden={hidden} onOKClick={onOKClick} onCancelClick={toggle}>
      确定要删除此项目？
    </Pop>
  )
}

const ConnectedDeletePop = connect(null, { deleteProject })(DeletePop)

export default DeletePop
