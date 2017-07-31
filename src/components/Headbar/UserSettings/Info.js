import React from 'react'
import { connect } from 'react-redux'
import { editMyName } from 'actions'

class Info extends React.Component {
  onCancel = () => {
    this.props.close()
  }

  onConfirm = _ => {
    const { editMyName, close, me } = this.props
    editMyName(this.input.value, me.id)
    close()
  }

  render() {
    const { me } = this.props
    return (
      <div
        className="w-100 ph4 flex flex-wrap justify-end"
        data-component="info"
      >
        <section className="h4 w-100 flex items-center">
          <label className="pr3">名字：</label>
          <input
            className="ba b--white pa2 hover-b outline-0"
            ref={n => {
              this.input = n
            }}
            defaultValue={me.name}
          />
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

const mapStateToProps = ({ me }) => ({ me })

const ConnectedInfo = connect(mapStateToProps, { editMyName })(Info)

export default ConnectedInfo
