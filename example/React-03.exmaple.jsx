import React from '../src/React'
import ReactDOM from '../src/ReactDOM'

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}

const element = <Welcome name='ULIVZ'/>

ReactDOM.render(
  element,
  document.getElementById('app')
)
