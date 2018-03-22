/*!
 * jreact v0.0.1
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

import React from '../src/React'
import ReactDOM from '../src/ReactDOM'

class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

ReactDOM.render(
  <Welcome name="ULIVZ"/>,  //  => React.createElement(Welcome, { name: 'ULIVZ' })
  document.getElementById('app')
)

