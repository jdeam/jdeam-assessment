import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    file: [],
  };

  handleFileUpload = () => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      const file = JSON.parse(reader.result);
      this.setState({ file });
    });
    const uploadedFile = this.uploadInput.files[0];
    if (!uploadedFile) return this.setState({ file: [] });
    reader.readAsText(uploadedFile);
  };

  getContentType = (content) => {
    if (Array.isArray(content)) return "array";
    else if (content.tag) return "object";
    else if (content[0] === "<" && content.slice(-2) === "/>") return "html";
    else return "text";
  };

  convertHtmlToReactEl = (html, i) => {
    const [tag, ...attrs] = html.slice(1, -2).split(' ');
    const props = attrs.reduce((obj, attr) => {
      let [key, val] = attr.split("=");
      val = val.slice(1, -1);
      obj[key] = val;
      return obj;
    }, {});
    props.key = i;
    return React.createElement(tag, props);
  };

  convertArrayToReactEls = (arr) => {
    return arr.map((el, i) => {
      switch (this.getContentType(el.content)) {
        case "array":
          return React.createElement(
            el.tag, 
            { key: i }, 
            this.convertArrayToReactEls(el.content)
          );
        case "object":
          return React.createElement(
            el.tag,
            { key: i },
            this.convertArrayToReactEls([el.content])
          );
        case "html":
          return this.convertHtmlToReactEl(el.content, i);
        case "text":
          return React.createElement(
            el.tag,
            { key: i },
            el.content
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
            ref={ ref => this.uploadInput = ref }
            onChange={ this.handleFileUpload }
            type="file" 
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
