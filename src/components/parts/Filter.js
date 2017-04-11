//之后会改造，1. 数量多的时候，css调整，一行多个显示
// TODO: 2. auto-suggest

import React from 'react'
import { withRouter } from 'react-router'

class Filter extends React.Component {

  state = { isOpen: false, id:1 }

  componentWillReceiveProps(nextProps) {//切换到别的task时，不再展开
    if(this.props.location.pathname !== nextProps.location.pathname){
      this.setState({isOpen:false})
    }
  }

  componentWillUnmount() {

  }

  handleTitleClick = () => {
    this.setState({isOpen:!this.state.isOpen})
  }

  handleListClick = ({ id,index,completed,search }) => {
    this.setState({ id,isOpen:false })
    this.props.changeTitle({completed,search})
  }

  render() {
    const { filterArray } = this.props
    const array = filterArray.filter(arr => arr.id !== this.state.id)
    const { name:title } = filterArray.find(arr => arr.id === this.state.id)
    // const arr = filterArray.find(arr => arr.id === titleId)
    //
    // console.log(title,titleId,arr);
    return (
      <div className="Filter">
        <header onClick={this.handleTitleClick}>
          {title}
        </header>
        {
          this.state.isOpen &&
          <ul className='FilterList'>
            {
              array.map(({ id,name,completed,search }) => {
                return (
                  <li key={id} onClick={ _ => this.handleListClick({id,completed,search})}>
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

Filter.propTypes = {
  // titleId: React.PropTypes.string.isRequired,
  filterArray: React.PropTypes.array.isRequired,
  changeTitle: React.PropTypes.func.isRequired,
}

Filter = withRouter(Filter)

// dropArray: 要包含nothing的情况,如果有别的情况也方便扩展
// [
//    {name:nameIfNothing,completed:'...',search:'...'},
//   {name,completed:'...',search:'...'},
// ]

export default Filter
