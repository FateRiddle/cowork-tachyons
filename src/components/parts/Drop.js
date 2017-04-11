//之后会改造，1. 数量多的时候，css调整，一行多个显示
// TODO: 2. auto-suggest

import React from 'react'
import { withRouter } from 'react-router'

class Drop extends React.Component {

  state = { isOpen: false }

  componentWillReceiveProps(nextProps) {//切换到别的task时，不再展开
    if(this.props.location.pathname !== nextProps.location.pathname){
      this.setState({isOpen:false})
    }
  }

  handleTitleClick = () => {
    this.setState({isOpen:!this.state.isOpen})
  }

  handleListClick = id => {
    this.props.changeTitle(id)
    this.setState({isOpen:false})
  }

  render() {
    const { titleId,dropArray } = this.props
    const array = dropArray.filter(arr => arr.id !== titleId)
    const { name:title } = dropArray.find(arr => arr.id === titleId)
    // const arr = dropArray.find(arr => arr.id === titleId)
    //
    // console.log(title,titleId,arr);
    return (
      <div className="Drop">
        <header onClick={this.handleTitleClick}>
          {title}
        </header>
        {
          this.state.isOpen &&
          <ul className='DropList'>
            {
              array.map(({ name,id },index) => {
                return (
                  <li key={index} onClick={ _ => this.handleListClick(id)}>
                    {name}
                  </li>
                )
              })
            }
          </ul>
        }

      </div>
    )
  }
}

Drop.propTypes = {
  titleId: React.PropTypes.string.isRequired, // if nothing: ''
  dropArray: React.PropTypes.array.isRequired,
  changeTitle: React.PropTypes.func.isRequired,
}

Drop = withRouter(Drop)

// dropArray: 要包含nothing的情况,如果有别的情况也方便扩展
// [
//    {nameIfNothing,''},
//   {name,id},
// ]

export default Drop
