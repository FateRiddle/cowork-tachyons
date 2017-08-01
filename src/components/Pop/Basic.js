import React from 'react'
import PropTypes from 'prop-types'
import ClickOutside from 'react-click-outside'

class Pop extends React.Component {
  render() {
    const { hidden, children, close } = this.props
    return (
      !hidden &&
      <div
        className="absolute top-0 left-0 vw-100 vh-100 bg-black-20 z-2 flex-center"
        data-component="mask"
      >
        <ClickOutside
          className="relative w-30 pv4 min-w6 shadow-1 bg-white z-4"
          data-component="Pop"
          onClickOutside={close}
        >
          {children}
        </ClickOutside>
      </div>
    )
  }
}

Pop.propTypes = {
  hidden: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  children: PropTypes.element
}

export default Pop
