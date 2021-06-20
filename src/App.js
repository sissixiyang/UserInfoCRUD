import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import CreateSoldier from "./components/CreateSoldier";
import EditSoldier from "./components/EditSoldier";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/createSoldier" component={CreateSoldier} />
          <Route path="/editSoldier/" component={EditSoldier} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
