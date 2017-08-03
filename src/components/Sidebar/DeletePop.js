import React from 'react'
import { connect } from 'react-redux'
import Pop from 'components/Pop'
import Confirm from 'components/Pop/Confirm'
import { deleteProject } from 'actions'

const DeletePop = ({ id, hidden, toggle, canDelete, deleteProject }) => {
  const onOKClick = _ => {
    deleteProject(id)
    toggle()
  }
  return canDelete
    ? <Pop hidden={hidden} onOKClick={onOKClick} onCancelClick={toggle}>
        <div className="pb4">确定要删除此项目？</div>
      </Pop>
    : <Confirm hidden={hidden} onOKClick={toggle}>
        <div className="pb4">无法删除有任务的项目。</div>
      </Confirm>
}

const ConnectedDeletePop = connect(null, { deleteProject })(DeletePop)

export default ConnectedDeletePop
