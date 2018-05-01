import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    file: [],
  };

  handleFileUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      const file = JSON.parse(reader.result);
      this.setState({ file });
    });
    const upload = this.uploadInput.files[0];
    if (!upload) return this.setState({ file: [] });
    const blob = upload.slice(0);
    reader.readAsText(blob);
  };

  convertArrayToReactEls = (arr) => {
    return arr.map((el, i) => {
      if (Array.isArray(el.content)) {
        return React.createElement(
          el.tag, 
          { key: i }, 
          this.convertArrayToReactEls(el.content)
        );
      } else if (el.content.tag) {
        return React.createElement(
          el.tag,
          { key: i },
          this.convertArrayToReactEls([el.content])
        );
      } else if (this.elIsHtml(el.content)) {
        return this.convertHtmlToReactEl(el.content, i);
      } else {
        return React.createElement(
          el.tag,
          { key: i },
          el.content
        );
      }
    });
  };

  elIsHtml = (el) => {
    const firstChar = el[0];
    const lastChar = el[el.length-1];
    if (firstChar === "<" && lastChar === ">") return true;
    return false;
  };

  convertHtmlToReactEl = (html, i) => {
    const htmlArr = html.split(' ');
    const [first, ...rest] = htmlArr;
    const tag = first.slice(1);
    const props = rest.reduce((props, attr, j, arr) => {
      let [key, value] = attr.split("=");
      if (j === arr.length-1) value = value.slice(1, -3);
      else value = value.slice(1, -1);
      props[key] = value;
      return props;
    }, {});
    props.key = i;
    return React.createElement(tag, props, null);
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">WDI Resident Code Challenge</h1>
        </header>
        <div className="App-intro">
          <input 
            ref={ (ref) => { this.uploadInput = ref; } }
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
