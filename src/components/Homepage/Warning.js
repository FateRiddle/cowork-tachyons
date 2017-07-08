import React from 'react'
import { connect } from 'react-redux'
import { resetErrorMessage } from '../../actions'
import { withRouter } from 'react-router'

class HomePageWarning extends React.PureComponent {
  componentWillReceiveProps(nextProps) {
    console.log('this', this.props.warning, 'next', nextProps.warning)
    if (
      !nextProps.warning ||
      this.props.location.pathname !== nextProps.location.pathname
    ) {
      //router change will trigger reset(withRouter)
      this.props.resetErrorMessage()
    }
  }

  componentWillUnmount() {
    this.props.resetErrorMessage()
  }

  render() {
    return this.props.warning
      ? <div className="Warning">
          {this.props.warning}
        </div>
      : null
  }
}

HomePageWarning = withRouter(
  connect(({ warning }) => ({ warning }), {
    resetErrorMessage
  })(HomePageWarning)
)

export default HomePageWarning
