import React from "react";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import { Switch, Route } from "react-router-dom";

export default function App() {
  return (
    <main>
      <Switch>
        <Route path="/" component={Landing} exact />
        <Route path="/home" component={Home} exact />
      </Switch>
    </main>
  );
}
