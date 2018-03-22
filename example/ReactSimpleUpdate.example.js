import React from '../src/React'
import ReactDOM from '../src/ReactDOM'

const App = React.createClass({
  getInitialState () {
    return {
      status: 'show'
    };
  },
  changeType () {
    this.props.name = '123'
    this.setState({
      status: 'hidden'
    })
  },
  render () {
    return React.createElement('div', {
      onclick: this.changeType.bind(this)
    }, this.state.status, 'Hello ', this.props.name)
  }
})

ReactDOM.render(React.createElement(App, {
  name: 'ULIVZ'
}), document.getElementById('app'))
