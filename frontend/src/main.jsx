import { Buffer } from "buffer";
if (typeof global === "undefined") {
  window.global = window;
}
if (typeof window.Buffer === "undefined") {
  window.Buffer = Buffer;
}
if (typeof window.process === "undefined") {
  window.process = { env: {} }; // sometimes needed
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
