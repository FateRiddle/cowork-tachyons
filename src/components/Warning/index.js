import React from 'react'
import { connect } from 'react-redux'
import { resetErrorMessage } from 'actions'

class Warning extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    const { resetErrorMessage, warning } = this.props
    if (warning && prevProps.warning !== warning) {
      setTimeout(resetErrorMessage, 2000)
    }
  }

  render() {
    const { warning, className } = this.props
    console.log(this.props)
    return warning
      ? <div data-component="Warning" className={className}>
          {warning}
        </div>
      : null
  }
}

Warning.propTypes = {
  className: React.PropTypes.string.isRequired
}

const mapStateToProps = ({ warning }) => ({ warning: warning.main })

Warning = connect(mapStateToProps, {
  resetErrorMessage
})(Warning)

export default Warning
