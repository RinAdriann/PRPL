import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import { AuthProvider } from "./state/AuthContext";
import { ChildProvider } from "./state/ChildContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ChildProvider>
          <App />
        </ChildProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
