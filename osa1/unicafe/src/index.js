import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

// tehtävä 1.10
// const StatisticLine = ({ text, value }) => <p>{text} {value}</p>

// tehtävä 1.11
const TableRow = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({ good, neutral, bad }) => {
  const calcTotal = () => good + neutral + bad
  const calcAverage = () => (good - bad) / calcTotal()
  const calcPositive = () => (good / calcTotal()) * 100

  if (calcTotal() <= 0) {
    return (
      <p>No feedback given</p>
    )
  }

  // tehtävä 1.10
  // return (
  //   <div>
  //     <StatisticLine text="good" value={good} />
  //     <StatisticLine text="neutral" value={neutral} />
  //     <StatisticLine text="bad" value={bad} />
  //     <StatisticLine text="all" value={calcTotal()} />
  //     <StatisticLine text="average" value={calcAverage()} />
  //     <StatisticLine text="positive" value={calcPositive() + ' %'} />
  //   </div>
  // )

  // tehtävä 1.11
  return (
    <table>
      <tbody>
        <TableRow text="good" value={good} />
        <TableRow text="neutral" value={neutral} />
        <TableRow text="bad" value={bad} />
        <TableRow text="all" value={calcTotal()} />
        <TableRow text="average" value={calcAverage()} />
        <TableRow text="positive" value={calcPositive() + ' %'} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1)
  const handleBadClick = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button handleClick={handleGoodClick} text="good" />
        <Button handleClick={handleNeutralClick} text="neutral" />
        <Button handleClick={handleBadClick} text="bad" />
      </div>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)