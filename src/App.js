import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    file: [],
  };

  readFile = (e) => {
    const file = JSON.parse(e.target.result);
    this.setState({ file });
  };

  handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return this.setState({ file: [] });
    const reader = new FileReader();
    reader.onload = this.readFile;
    reader.readAsText(uploadedFile);
  };

  getContentType = (content) => {
    if (Array.isArray(content)) return "array";
    if (content.tag) return "object";
    if (content[0] === "<" && content.slice(-2) === "/>") return "html";
    return "text";
  };

  convertHtmlToReactEl = (html, key) => {
    const [tag, ...attrs] = html.slice(1, -2).split(' ');
    const props = attrs.reduce((obj, attr) => {
      let [key, val] = attr.split("=");
      val = val.slice(1, -1);
      obj[key] = val;
      return obj;
    }, {});
    return React.createElement(tag, { ...props, key });
  };

  convertArrayToReactEls = (arr) => {
    return arr.map((el, key) => {
      const { tag, content } = el;
      switch (this.getContentType(content)) {
        case "array":
          return React.createElement(
            tag, 
            { key }, 
            this.convertArrayToReactEls(content)
          );
        case "object":
          return React.createElement(
            tag,
            { key },
            this.convertArrayToReactEls([content])
          );
        case "html":
          return this.convertHtmlToReactEl(content, key);
        case "text":
          return React.createElement(
            tag,
            { key },
            content
          );
        default:
          return null;
      }
    });
  };

  render() {
    return (
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
}

export default App;
