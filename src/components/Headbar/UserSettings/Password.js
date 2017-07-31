import React from 'react'
import { connect } from 'react-redux'
import { editMyPassword, changeUserWarning } from 'actions'
import Warning from 'components/Warning/userSettings'

class Password extends React.Component {
  state = {
    oldPass: '',
    newPass: '',
    passAgain: ''
  }

  componentDidUpdate(prevProps, prevState) {
    const { warning } = prevProps
    const { changeUserWarning } = this.props
    const { oldPass, newPass, passAgain } = this.state
    const {
      oldPass: _oldPass,
      newPass: _newPass,
      passAgain: _passAgain
    } = prevState
    if (oldPass === '' && _oldPass !== '') {
      changeUserWarning('请填写原密码。')
    } else if (newPass === '' && _newPass !== '') {
      changeUserWarning('新密码不能为空。')
    } else if (newPass && passAgain && newPass !== passAgain) {
      changeUserWarning('两次密码填写不一致。')
    } else if (warning) {
      changeUserWarning('')
    }
  }

  componentWillUnmount() {
    this.setState({
      oldPass: '',
      newPass: '',
      passAgain: ''
    })
    this.props.changeUserWarning('')
  }

  onChangeOldPass = e => this.setState({ oldPass: e.target.value })

  onChangeNewPass = e => this.setState({ newPass: e.target.value })

  onChangePassAgain = e => this.setState({ passAgain: e.target.value })

  onCancel = () => {
    this.props.close()
  }
  onConfirm = () => {
    const { editMyPassword, close, warning } = this.props
    if (!warning) {
      this.props.editMyPassword(this.state.newPass).then(_ => {
        if (!warning) {
          this.props.close()
        }
      })
    }
  }

  render() {
    const { oldPass, newPass, passAgain } = this.state
    const { warning } = this.props
    return (
      <div className="w-100 ph4 flex flex-wrap justify-end">
        <main className="pt4 ph4 w-100 flex flex-wrap">
          <section className="w-100 pa2">
            <label className="dib w-25">原密码：</label>
            <input
              className={`w5 ba pa2 outline-0 ${warning === '请填写原密码。'
                ? 'b--red'
                : 'b--black-30'}`}
              value={oldPass}
              onChange={this.onChangeOldPass}
              type="password"
            />
          </section>
          <section className="w-100 pa2">
            <label className="dib w-25">新密码：</label>
            <input
              className={`w5 ba pa2 outline-0 ${warning === '新密码不能为空。'
                ? 'b--red'
                : 'b--black-30'}`}
              value={newPass}
              onChange={this.onChangeNewPass}
              type="password"
            />
          </section>
          <section className="w-100 pa2">
            <label className="dib w-25">再次输入：</label>
            <input
              className={`w5 ba pa2 outline-0 ${warning === '两次密码填写不一致。'
                ? 'b--red'
                : 'b--black-30'}`}
              value={passAgain}
              onChange={this.onChangePassAgain}
              type="password"
            />
          </section>
        </main>
        <section className="h2 w-100">
          <Warning className="red pt1 ph4 tc" />
        </section>
        <div
          className="ph3 pv2 dim tracked f5 tc mw4 br2 ba b--cyan cyan mr3 pointer"
          onClick={this.onCancel}
        >
          取消
        </div>
        <div
          className="ph3 pv2 dim tracked f5 tc mw4 br2 b--cyan bg-cyan white pointer"
          onClick={this.onConfirm}
        >
          确定
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ me, warning }) => ({
  me,
  warning: warning.userSettings
})

const ConnectedPassword = connect(mapStateToProps, {
  changeUserWarning,
  editMyPassword
})(Password)

export default ConnectedPassword
