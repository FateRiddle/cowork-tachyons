import React from 'react'

class DropMenu extends React.Component {

  render() {
    const dropArray = this.props
    return <ul className='Drop__list'>
      {
        dropArray.map(({ id,name,onClick },index) => {
          return (
            <li key={index} onClick={onClick}>
              {name}
            </li>
          )
        })
      }
    </ul>
  }
}

export default DropMenu
