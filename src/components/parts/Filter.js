//之后会改造，1. 数量多的时候，css调整，一行多个显示
// TODO: 2. auto-suggest

import React from 'react'
import { withRouter } from 'react-router'
import classnames from 'classnames'

class Filter extends React.Component {
  state = { isOpen: false }

  componentWillReceiveProps(nextProps) {
    //切换到别的task时，不再展开
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.setState({ isOpen: false })
    }
  }

  componentWillUnmount() {}

  handleTitleClick = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  handleListClick = filter => {
    this.setState({ isOpen: false })
    this.props.changeTitle(filter)
  }

  render() {
    const { filterArray, titleId } = this.props
    const array = filterArray.filter(arr => arr.id !== titleId)
    const { name } = filterArray.find(arr => arr.id === titleId)
    // const arr = filterArray.find(arr => arr.id === titleId)
    //
    // console.log(title,titleId,arr);
    return (
      <div className={classnames('Filter', this.props.className)}>
        <header onClick={this.handleTitleClick}>
          {name}
        </header>
        {this.state.isOpen &&
          <ul className="Drop__list">
            {array.map(filter => {
              return (
                <li key={filter.id} onClick={_ => this.handleListClick(filter)}>
                  {filter.name}
                </li>
              )
            })}
          </ul>}

      </div>
    )
  }
}

Filter.propTypes = {
  // titleId: string or number
  filterArray: React.PropTypes.array.isRequired,
  changeTitle: React.PropTypes.func.isRequired,
  className: React.PropTypes.string
}

Filter = withRouter(Filter)

// dropArray: 要包含nothing的情况,如果有别的情况也方便扩展
// [
//    {name:nameIfNothing,completed:'...',search:'...'},
//   {name,completed:'...',search:'...'},
// ]

export default Filter
