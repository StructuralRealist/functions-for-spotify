import { createGlobalStyle } from "styled-components";
import "normalize.css";

export default createGlobalStyle`
  :root {
    --primary: #5465FF;
    --secondary: #FFCB52;
  }

  *:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--secondary);
  }

  body {
    background-color: var(--primary);
    font-family: "Anonymous Pro", monospace;
    font-size: 18px;
    color: white;
  }

  a {
    color: var(--secondary);
  }

  button {
    background-color: var(--secondary);
    color: black;
    font-weight: bold;
    border: none;
    padding: 2px 12px;
    border-radius: 40px;
    cursor: pointer;

    &:disabled {
      background-color: #F0FCFC;
      color: #b7c1c1;
      cursor: default;
    }
  }

  input {
    background-color: white;
    border: none;
    border-radius: 3px;
    padding: 8px;
    font-family: "Anonymous Pro", monospace;
  }
`;
