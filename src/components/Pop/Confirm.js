import React from 'react'
import PropTypes from 'prop-types'

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
  hidden: PropTypes.bool.isRequired,
  onOKClick: PropTypes.func.isRequired,
  children: PropTypes.element
}

export default Pop
