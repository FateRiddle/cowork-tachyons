import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Dropdown, Icon } from 'semantic-ui-react'

class Tags extends React.Component {
  options = [
    { key: 1, text: '重要', color: 'red', value: 1 },
    { key: 2, text: '暂不处理', color: 'yellow', value: 2 },
    { key: 3, text: '新需求', color: 'blue', value: 3 }
  ]

  renderLabel = (label, index, props) => ({
    color: label.color,
    content: label.text
  })

  render() {
    const { canEdit, task } = this.props
    return (
      <div className="flex items-center" data-component="Tags">
        <div className="ph3">
          <Icon className="black-50" name="tag" size="large" />
        </div>
        {canEdit
          ? <Dropdown
              className="pl5  black-50 hover-thin-blue"
              multiple
              selection
              placeholder="请选择一个标签"
              value={task.tag}
              options={this.options}
              renderLabel={this.renderLabel}
              // onChange={this.}
            />
          : <div className="pb2 black-50">haha</div>}
      </div>
    )
  }
}

const mapStateToProps = state => ({ state })

const ConnectedTags = withRouter(connect(mapStateToProps)(Tags))

export default Tags
