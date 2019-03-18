import React, { useState, useEffect } from 'react';

import logo from './logo.svg';
import './App.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

function App() {
  const [dragging, setDragging] = useState(false);
  const [projectDir, setProjectDir] = useState(null);

  const handleDrop = e => {
    setProjectDir(e.dataTransfer.files[0].path);
    setDragging(false);
    e.preventDefault();
  };

  const handleDragOver = e => {
    setDragging(true);
    e.preventDefault();
  };

  const handleDragEnd = e => {
    setDragging(false);
    e.preventDefault();
  };

  useEffect(() => {
    if (projectDir) {
      ipcRenderer.send('launch-project-request', projectDir);
      ipcRenderer.on('launch-project-response', (event, arg) => {
        console.log(arg);
      });
    }
  }, [projectDir]);

  return (
    <div className="App">
      <header
        className={`App-header ${dragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragLeave={handleDragEnd}
      >
        <img src={logo} className="App-logo" alt="logo" />
        {!dragging && (
          <p>Drag a project directory into the window to launch.</p>
        )}
        {dragging && <p>Drop!</p>}
        {projectDir && <p>currently viewing {projectDir}</p>}
      </header>
    </div>
  );
}

export default App;
