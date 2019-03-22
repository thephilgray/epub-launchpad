import React, { useState, useEffect } from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';

import Layout from './components/Layout';
import HorizontalNonLinearAlternativeLabelStepper from './components/HorizontalNonLinearAlternativeLabelStepper';

const { ipcRenderer } = window.require('electron');

function App() {
  const [dragging, setDragging] = useState(false);
  const [projectDir, setProjectDir] = useState(null);
  const [dropped, setDropped] = useState(false);

  const handleDrop = e => {
    setProjectDir(e.dataTransfer.files[0].path);
    setDragging(false);
    setDropped(true);
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

  const launch = () => {
    if (!projectDir) return;

    ipcRenderer.send('launch-project-request', projectDir);
    ipcRenderer.on('launch-project-response', (event, arg) => {
      console.log(arg);
    });
  };

  // useEffect(() => {
  //   if (projectDir) {
  //     ipcRenderer.send('launch-project-request', projectDir);
  //     ipcRenderer.on('launch-project-response', (event, arg) => {
  //       console.log(arg);
  //     });
  //   }
  // }, [projectDir]);

  return (
    <Layout>
      <CssBaseline />
      <div className="App">
        <header
          className={`App-header ${dragging ? 'dragging' : ''} ${
            dropped ? 'dropped' : ''
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragLeave={handleDragEnd}
        >
          <HorizontalNonLinearAlternativeLabelStepper
            dragging={dragging}
            launch={launch}
            projectDir={projectDir}
            dropped={dropped}
            setDropped={setDropped}
          />
        </header>
      </div>
    </Layout>
  );
}

export default App;
