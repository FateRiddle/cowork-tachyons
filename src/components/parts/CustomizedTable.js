import React from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { defaultTableRowRenderer, Table } from 'react-virtualized'

const SortableTable = SortableContainer(Table)
const SortableTableRowRenderer = SortableElement(defaultTableRowRenderer)

const rowRenderer = props => {
  return <SortableTableRowRenderer {...props} />
}

const CustomizedTable = props => {
  return <SortableTable rowRenderer={rowRenderer} {...props} />
}

export default CustomizedTable
