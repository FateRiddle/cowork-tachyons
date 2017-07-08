import React from 'react'
import { connect } from 'react-redux'
import { resetErrorMessage } from 'actions'

class Warning extends React.PureComponent {
  componentWillReceiveProps(nextProps) {
    if (nextProps.warning) {
      setTimeout(this.props.resetErrorMessage, 2000)
    }
  }

  render() {
    return this.props.warning
      ? <div className="Warning">
          {this.props.warning}
        </div>
      : null
  }
}

const mapStateToProps = ({ warning }) => {
  console.log(warning)
  return { warning }
}

Warning = connect(mapStateToProps, {
  resetErrorMessage
})(Warning)

export default Warning
