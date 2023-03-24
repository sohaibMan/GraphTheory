import React, { useEffect } from "react";
import TLN from "./tawl.min.js";
const TextAreaWithLineNumber = (props: any) => {
  const {
    lineNumberBackground = "#fff",
    lineNumberTextColor = "#000",
    textAreaBackgroundColor = "#fff",
    textAreaTextColor = "#000",
    border = "1px solid #ddd",
    height = "30vh",
    textAreaFontSize = "1rem",
    lineNumberFontSize = "1rem",
    scrollbarWidth = "6px",
    scrollbarTrackColor = "transparent",
    srollbarThumbColor = "#888",
    onChange = () => {},
    value = undefined,
    placeholder = "input your text here",
    textAreaFontFamily = "",
    lineNumberFontFamily = "",
  } = props;
  const style = `
.tawln-active,
.tawln-wrapper,
.tawln-line {
  margin: 0;
  border: 0;
  padding: 0;
  outline: 0;
  display: flex;
  box-sizing: border-box;
  vertical-align: middle;
  list-style: none;
}
.tawln-active {
  display: inline-block;
  padding: 0.625em;
  width: calc(100% - 3em);
  height: 100%;
  word-break: break-all;
  resize: none;
  overflow-wrap: normal;
  overflow-x: auto;
  white-space: pre;
  font: ${lineNumberFontSize} ${lineNumberFontFamily}, monospace;
}
.tawln-wrapper {
  width: 4em;
  text-align: center;
  padding: 0.6875em 0.3125em 2.1875em;
  height: 100%;
  word-break: break-all;
  background-color: ${lineNumberBackground};
  overflow: hidden;
  display: inline-block;
  counter-reset: line;
  border-right:${border}
}
.tawln-line {
  width: 100%;
  display: block;
  text-align: right;
  line-height: 2rem;
  font-size: ${lineNumberFontSize};
  font-family:${lineNumberFontFamily};
  color: ${lineNumberTextColor};
  text-align: center;
}
.tawln-line::before {
  counter-increment: line;
  content: counter(line);
  font-size: ${lineNumberFontSize};
  user-select: none;
  color:${lineNumberTextColor}
}

.source-wrapper{
display:flex;
  height: ${height};
}
.source::-webkit-scrollbar {
  width:${scrollbarWidth};
}
.source::-webkit-scrollbar-track {
  background: ${scrollbarTrackColor};
}
.source::-webkit-scrollbar-thumb {
  background: ${srollbarThumbColor};
}
.source {
  width: 100%;
  background-color:${textAreaBackgroundColor};
  color:${textAreaTextColor};
  background-blend-mode: overlay;
  max-height: 100%;
  font-size: ${textAreaFontSize};
  font-family:${textAreaFontFamily}
  resize: none;
  overflow-y: scroll;
  border: none;
  outline: none;
  padding-left: 35px;
  padding-top: 10px;
  padding-bottom: 0;
  line-height:2rem;
}


      `;

  useEffect(() => {
    TLN.append_line_numbers("text-area-with-line-number");
  }, [props]);

  return (
    <div>
      <style>{style}</style>
      <div id="wrapper" className="source-wrapper">
        <textarea
          id="text-area-with-line-number"
          required
          name="solution"
          onChange={onChange}
          onKeyUp={onChange}
          className="source"
          value={value}
          placeholder={placeholder}
        ></textarea>
      </div>
    </div>
  );
};

export default TextAreaWithLineNumber;
