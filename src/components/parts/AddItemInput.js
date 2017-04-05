import React from 'react'

class AddItemInput extends React.Component {

  constructor(props){
    super(props)
    this.handleAddItem = this.handleAddItem.bind(this)
  }

  handleAddItem(){
    this.props.addItem(this.input.value)
    this.input.value = ''
  }

  render(){
    const { placeholder } = this.props
    return (
      <div className='AddItemInput'>
        <input ref={node => {this.input = node}}
          placeholder={placeholder}
          onKeyDown={ e => {
            if(e.key === 'Enter' && this.input.value !== '') this.handleAddItem()
          }}
        />
        <button onClick={()=> {
          if(this.input.value !== '') this.handleAddItem()
        }} > + </button>
      </div>
    )
  }
}

AddItemInput.propTypes = {
  addItem: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string.isRequired,
}

export default AddItemInput
