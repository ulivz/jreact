import React from '../src/React'
import ReactDOM from '../src/ReactDOM'

function clickHandler() {
  console.log('Clicked')
}

const element = React.createElement('div', {
  id: 'wrapper',
  onclick: clickHandler
}, [React.createElement('div', { class: 'qiang' }, 'Luke')])

ReactDOM.render(element, document.getElementById('app'))
