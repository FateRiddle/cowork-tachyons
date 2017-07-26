import React from 'react'
import { connect } from 'react-redux'
import { getUserById, getAlltasks } from 'reducers'

class Person extends React.Component {
  graphPercent = amount => {
    if (amount > 64) {
      return '82%'
    }
    return `${Math.sqrt(amount) * 10 + 2}%`
  }

  render() {
    const { user, amount, completedAmount } = this.props
    console.log(user, amount, completedAmount)

    return (
      <li className="flex flex-wrap items-center">
        <div className="w-100 pv2">{user ? user.name : ''}:</div>
        <section
          className="relative h2 bg-light-gray"
          style={{ width: `${this.graphPercent(amount)}` }}
        >
          <div
            className="absolute top-0 left-0 h-100 bg-cyan"
            style={{ width: `${completedAmount / amount * 100}%` }}
          />
        </section>
        <section className="pl3">
          <div>总共：{amount} 天</div>
          <div>完成：{Math.floor(completedAmount)} 天</div>
        </section>

      </li>
    )
  }
}

const mapStateToProps = (state, { id }) => {
  const user = getUserById(state, id)
  const tasks = getAlltasks(state).filter(
    t => t.assignee === id && t.hasSubtask === 0
  ) //all the top tasks is not acount for amount
  const amount = tasks.map(t => t.amount || 1).reduce((a, b) => a + b, 0)
  const completedAmount = tasks
    .map(t => {
      const amount = t.amount || 1
      const progress = t.completed === 'completed' ? 100 : t.progress || 0
      return amount * progress / 100
    })
    .reduce((a, b) => a + b, 0)
  return { user, tasks, amount, completedAmount }
}

const ConnectedPerson = connect(mapStateToProps)(Person)

export default ConnectedPerson
