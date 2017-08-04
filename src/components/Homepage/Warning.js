import React from 'react'
import { connect } from 'react-redux'
import { resetErrorMessage } from 'actions'
import { withRouter } from 'react-router'

class HomePageWarning extends React.PureComponent {
  componentWillReceiveProps(nextProps) {
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
    const { warning } = this.props
    return warning
      ? <div
          data-component="Warning"
          className={`w-100 h3 f4 flex items-center pl3 tracked white ${warning ===
            '注册成功！请登录'
            ? 'bg-green'
            : 'bg-red'}`}
        >
          {this.props.warning}
        </div>
      : null
  }
}

HomePageWarning = withRouter(
  connect(({ warning }) => ({ warning: warning.home }), {
    resetErrorMessage
  })(HomePageWarning)
)

export default HomePageWarning
