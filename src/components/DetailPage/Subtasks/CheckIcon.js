import React from 'react'
import completedCheck from 'images/check-hover.png'
import normalCheck from 'images/check.png'

const CheckIcon = ({ completed, onClick }) =>
  <span className="CheckIcon" onClick={onClick}>
    {completed
      ? <img src={completedCheck} alt="" />
      : <img src={normalCheck} alt="" />}
  </span>

export default CheckIcon
