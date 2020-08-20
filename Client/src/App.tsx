import React from 'react';
import './styles.css';
import { Login } from './Screens/Login/Login';
import { Overview } from './Screens/Overview/Overview';
import EntryService from './Model/EntryService';
import { AppNotifications } from './Components/AppNotifications';

enum Screen {
  Login,
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

    //EntryService.load();

    this.state = {
      activeScreen: Screen.Login
    };
  }

  loginSuccessful() {
    
    this.setState({
      activeScreen: Screen.Overview
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
        return <Login loginSuccessful={() => this.loginSuccessful()} />;

      case Screen.Overview:
        return <Overview/>;
    }
  }
}

export default App;
