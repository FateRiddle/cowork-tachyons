import React from 'react'

class Pop extends React.Component {
  render() {
    const { hidden, children, onOKClick } = this.props
    return (
      !hidden &&
      <div className="Pop__mask">
        <div className="Pop">
          {children}
          <div className="Pop__button" onClick={onOKClick}>OK</div>
        </div>
      </div>
    )
  }
}

Pop.propTypes = {
  hidden: React.PropTypes.bool.isRequired,
  onOKClick: React.PropTypes.func.isRequired,
  children: React.PropTypes.element
}

export default Pop
