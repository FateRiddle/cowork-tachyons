import React from 'react'
import { connect } from 'react-redux'
import { editMyPassword, changeUserWarning } from 'actions'
import Warning from 'components/Warning/userSettings'

class Password extends React.Component {
  state = {
    oldPass: '',
    newPass: '',
    passAgain: '',
  }

  componentWillUnmount() {
    this.setState({
      oldPass: '',
      newPass: '',
      passAgain: '',
    })
    this.props.changeUserWarning('')
  }

  onChangeOldPass = e => {
    const { changeUserWarning, warning } = this.props
    const pass = e.target.value
    if (this.state.oldPass !== '' && pass === '') {
      changeUserWarning('请填写原密码。')
    } else if (warning === '请填写原密码。') {
      changeUserWarning('')
    }
    this.setState({ oldPass: pass })
  }

  onChangeNewPass = e => {
    const { changeUserWarning, warning } = this.props
    const { newPass, passAgain } = this.state
    const pass = e.target.value
    if (newPass !== '' && pass === '') {
      changeUserWarning('新密码不能为空。')
    } else if (passAgain && pass !== passAgain && warning !== '两次密码填写不一致。') {
      changeUserWarning('两次密码填写不一致。')
    } else if (warning === '新密码不能为空。' || warning === '两次密码填写不一致。') {
      changeUserWarning('')
    }
    this.setState({ newPass: pass })
  }

  onChangePassAgain = e => {
    const { changeUserWarning, warning } = this.props
    const pass = e.target.value
    if (pass && pass !== this.state.newPass && warning !== '两次密码填写不一致。') {
      changeUserWarning('两次密码填写不一致。')
    } else if (warning === '两次密码填写不一致。') {
      changeUserWarning('')
    }
    this.setState({ passAgain: pass })
  }

  onCancel = () => {
    this.props.close()
  }
  onConfirm = () => {
    const { oldPass, newPass } = this.state
    const { editMyPassword, close, warning, me } = this.props
    if (!warning) {
      editMyPassword(oldPass, newPass, me.id).then(res => {
        if (res.value.output.message === '') {
          close()
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
          <section className="w-100 flex items-center pa2">
            <label className="w-50 w-25-ns">原密码：</label>
            <input
              className={`w5 ba pa2 outline-0 ${warning === '请填写原密码。' ? 'b--red' : 'b--black-30'}`}
              value={oldPass}
              onChange={this.onChangeOldPass}
              type="password"
            />
          </section>
          <section className="w-100 flex items-center pa2">
            <label className="w-50 w-25-ns">新密码：</label>
            <input
              className={`w5 ba pa2 outline-0 ${warning === '新密码不能为空。' ? 'b--red' : 'b--black-30'}`}
              value={newPass}
              onChange={this.onChangeNewPass}
              type="password"
            />
          </section>
          <section className="w-100 flex items-center pa2">
            <label className="w-50 w-25-ns">再次输入：</label>
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
  warning: warning.userSettings,
})

const ConnectedPassword = connect(mapStateToProps, {
  changeUserWarning,
  editMyPassword,
})(Password)

export default ConnectedPassword
