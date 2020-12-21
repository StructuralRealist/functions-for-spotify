import { createGlobalStyle } from "styled-components";
import "normalize.css";

export default createGlobalStyle`
  :root {
   --primary: #5465FF;
   --secondary: #FFCB52;
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
  }
`;
