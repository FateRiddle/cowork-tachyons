import React from 'react'
import completedCheck from '../../images/check-hover.png'
import normalCheck from '../../images/check.png'

const CheckIcon = ({ completed, onClick }) =>
  <td className="CheckIcon" onClick={onClick}>
    {completed
      ? <img src={completedCheck} alt="" />
      : <img src={normalCheck} alt="" />}
  </td>

export default CheckIcon
