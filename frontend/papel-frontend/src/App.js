import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './style/App.css';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Popup from './Popup';
import asyncComponent from './asyncComponent';

class App extends React.Component {
  constructor(props) {
    super(props);
/*    this.state = { showPopup: false }; */
  }

  /*togglePopup() {
    this.setState({
    showPopup: !this.state.showPopup
    });
  }
*/
  menuItemOnClick(event) {
    const container = document.getElementById('container');

    switch (event.target.innerHTML) {
      case 'Home':
        ReactDOM.render(<Home />, container);
        break;
      case 'Login':
          ReactDOM.render(<Login />, container);
          break;
      case 'Register':
        ReactDOM.render(<Register />, container);
        break;

      case 'Profile':
        ReactDOM.render(<Profile />, container);
        break;
    }
  }
  render() {
    return (

    <div>


    <ul id="menu">
      <li onClick={this.menuItemOnClick}><strong>HOME</strong></li>
      <li onClick={this.menuItemOnClick}><strong>Login</strong></li>
      <li onClick={this.menuItemOnClick}><strong>Register</strong></li>
      <li onClick={this.menuItemOnClick}><strong>Profile</strong></li>
    </ul>
    <div id="container"><Register /></div>
  </div>
    );
  }
}

export default App;
