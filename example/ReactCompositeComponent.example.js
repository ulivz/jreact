import React from '../src/React'
import ReactDOM from '../src/ReactDOM'

const Child1 = React.createClass({
  getInitialState () {
    return { name: 'child1' };
  },
  componentWillMount() {
    console.log(this.state.name + ' will mount')
  },
  componentDidMount () {
    console.log(this.state.name + ' did mount')
  },
  render () {
    return React.createElement('div', { class: 'child1' }, this.state.name)
  }
})

const Child2 = React.createClass({
  getInitialState () {
    return { name: 'child2' };
  },
  componentWillMount() {
    console.log(this.state.name + ' will mount')
  },
  componentDidMount () {
    console.log(this.state.name + ' did mount')
  },
  render () {
    return React.createElement('div', { class: 'child2' }, this.state.name)
  }
})

const App = React.createClass({
  getInitialState () {
    return { message: 'Hello' };
  },
  componentWillMount() {
    console.log('App will mount')
  },
  componentDidMount: function () {
    console.log('App did mount')
  },
  render () {
    return React.createElement('div', { class: 'app' }, this.state.message, ', ', this.props.name, React.createElement(Child1), React.createElement(Child2))
  }
})

ReactDOM.render(React.createElement(App, { name: 'ULIVZ' }), document.getElementById('app'))

