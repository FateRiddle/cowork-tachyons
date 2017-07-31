import React from 'react'

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
  tabs: React.PropTypes.array.isRequired, //{value,name}
  tab: React.PropTypes.string.isRequired, //value
  toggle: React.PropTypes.func.isRequired,
  className: React.PropTypes.string.isRequired
}

export default Tabs
