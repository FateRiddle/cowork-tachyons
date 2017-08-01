import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Warning = ({ warning, className }) =>
  warning
    ? <div data-component="Warning" className={className}>
        {warning}
      </div>
    : null

Warning.propTypes = {
  className: PropTypes.string.isRequired
}

const mapStateToProps = ({ warning }) => ({ warning: warning.userSettings })

const ConnectedWarning = connect(mapStateToProps)(Warning)

export default ConnectedWarning
