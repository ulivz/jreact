import React from '../src/React'
import ReactDOM from '../src/ReactDOM'

function clickHandler() {
  console.log('Clicked')
}

const element = React.createElement('div', { id: 'wrapper', onclick: clickHandler }, 'click me')

ReactDOM.render(element, document.getElementById('app'))
