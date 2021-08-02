import React from "react";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import "./App.css";
import "./features/auth/styles.css";
import Login from "./features/auth/Login";
import AppRouter from "./router";

function App() {
  return <AppRouter />;
}

export default App;
