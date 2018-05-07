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

  arrayToReactEls = (arr) => {
    return arr.map((el, key) => {
      let children;
      let props = { key };
      const { tag, content } = el;
      if (Array.isArray(content)) children = this.arrayToReactEls(content);
      else if (content.tag) children = this.arrayToReactEls([content]);
      else if (content[0] === "<" && content.slice(-2) === "/>") {
        props.dangerouslySetInnerHTML = { __html: content };
      } 
      else children = content;
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
        { this.arrayToReactEls(this.state.file) }
      </div>
    </div>
  );
}

export default App;
