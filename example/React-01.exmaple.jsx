/*!
 * jreact v0.0.1
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

import React from '../src/React'
import ReactDOM from '../src/ReactDOM'

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

ReactDOM.render(
  <Welcome name="ULIVZ"/>,
  document.getElementById('app')
)

