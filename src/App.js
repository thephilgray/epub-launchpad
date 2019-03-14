import React, { Component } from "react";
import LaunchEpub from "launch-epub";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectDir: ""
    };
  }

  launchServer = () => {};

  handleDrop = e => {
    this.setState({ projectDir: e.dataTransfer.files[0].path });
    console.log(this.state.projectDir);
    const port = 4000;
    const browserSyncOptions = { open: false, port };
    const epubServer = new LaunchEpub(
      this.state.projectDir,
      browserSyncOptions
    );
    epubServer.start();

    window.open(
      `http://localhost:${port}/`,
      "_blank",
      "nodeIntegration=no,width=600,height=800"
    );

    e.preventDefault();
  };

  render() {
    return (
      <div className="App">
        <header
          className="App-header"
          onDrop={this.handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
