import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    file: [],
  };

  handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return this.setState({ file: [] });
    const reader = new FileReader();
    reader.onload = (e) => {
      const file = JSON.parse(e.target.result);
      this.setState({ file });
    };
    reader.readAsText(uploadedFile);
  };

  convertArrayToReactEls = (arr) => {
    return arr.map((el, key) => {
      let children;
      const props = { key };
      const { tag, content } = el;
      if (Array.isArray(content)) children = this.convertArrayToReactEls(content);
      else if (content.tag) children = this.convertArrayToReactEls([content]);
      else props.dangerouslySetInnerHTML = { __html: content };
      return React.createElement(tag, props, children);
    });
  };

  render = () => (
    <div className="App">
      <header className="App-header">
        <img src={ logo } className="App-logo" alt="logo" />
        <h1 className="App-title">Jordan's Cool App</h1>
      </header>
      <div className="App-intro">
        <input 
          type="file" 
          onChange={ this.handleFileUpload }
        /> 
      </div>
      <div className="File-area">
        { this.convertArrayToReactEls(this.state.file) }
      </div>
    </div>
  );
}

export default App;
