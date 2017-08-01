import React from 'react'
import PropTypes from 'prop-types'

const Tabs = ({ tabs, tab, toggle, className }) =>
  <ul className={className} data-component="tabs 信息/密码">
    {tabs.map((t, index) =>
      <li
        key={index}
        className={`pa1 mh3 b bb bw1 hover-black-60 hover-b--red pointer ${t.value ===
          tab
          ? 'black-60 b--red'
          : 'black-40 b--white'}`}
        onClick={_ => toggle(t.value)}
      >
        {t.name}
      </li>
    )}
  </ul>

Tabs.propTypes = {
  tabs: PropTypes.array.isRequired, //{value,name}
  tab: PropTypes.string.isRequired, //value
  toggle: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired
}

export default Tabs
