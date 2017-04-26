import React from 'react'

class Pop extends React.Component {

  render() {
    const { hidden,onClick,children } = this.props
    return (
      !hidden &&
      <div className="Pop">
        {children}
        <div className='Pop__button' onClick={onClick}>OK</div>
      </div>
    )
  }
}

Pop.propTypes = {
  hidden: React.PropTypes.bool.isRequired,
  onClick: React.PropTypes.func.isRequired,
  children: React.PropTypes.element,
}

export default Pop
