import React from 'react'
import { connect } from 'react-redux'

const Warning = ({ warning, className }) =>
  warning
    ? <div data-component="Warning" className={className}>
        {warning}
      </div>
    : null

Warning.propTypes = {
  className: React.PropTypes.string.isRequired
}

const mapStateToProps = ({ warning }) => ({ warning: warning.userSettings })

Warning = connect(mapStateToProps)(Warning)

export default Warning
