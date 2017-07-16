import React from 'react'
import completedCheck from 'images/check-hover.png'
import normalCheck from 'images/check.png'

const CheckIcon = ({ completed, onClick }) =>
  <span className="flex-center h2 w2" onClick={onClick}>
    {completed
      ? <img className="h-75 w-75" src={completedCheck} alt="" />
      : <img className="h-75 w-75" src={normalCheck} alt="" />}
  </span>

export default CheckIcon
