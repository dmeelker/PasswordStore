import React from 'react';
import './styles.css';
import { Login } from './Screens/Login/Login';
import { Overview } from './Screens/Overview/Overview';
import EntryService from './Model/EntryService';
import { AppNotifications } from './Components/AppNotifications';
import { RegisterScreen } from './Screens/Register/Register';

enum Screen {
  Login,
  Register,
  Overview
}

interface Props {

}

interface State {
  activeScreen: Screen;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      activeScreen: Screen.Login
    };
  }

  loginSuccessful() {
    
    this.setState({
      activeScreen: Screen.Overview
    });
  }

  onRegisterClicked() {
    this.setState({
      activeScreen: Screen.Register
    });
  }

  registerScreenClosed() {
    this.setState({
      activeScreen: Screen.Login
    });
  }

  public render() {
    return <>
      <AppNotifications/>
      {this.renderCurrentScreen()}
    </>
  }

  private renderCurrentScreen() {
    switch (this.state.activeScreen) {
      case Screen.Login:
        return <Login loginSuccessful={() => this.loginSuccessful()} onRegisterClicked={() => this.onRegisterClicked()} />;

      case Screen.Register:
        return <RegisterScreen onClose={() => this.registerScreenClosed()}/>

      case Screen.Overview:
        return <Overview/>;
    }
  }
}

export default App;
