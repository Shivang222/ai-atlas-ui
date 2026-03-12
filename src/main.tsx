import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './index.css'

console.log('main.tsx executing');

const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.innerHTML = "<h1 style='color:red'>HELLO FROM MAIN.TSX</h1>";
}
console.log('Root element found:', rootElement);

if (!rootElement) throw new Error('Failed to find the root element');

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
  console.log('React finished rendering synchronously');
} catch (e) {
  console.error("Error during ReactDOM.render", e);
}
