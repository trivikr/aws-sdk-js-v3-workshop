import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { PageContainer } from "./components";

const ListNotes = lazy(() => import("./content/ListNotes"));
const CreateNote = lazy(() => import("./content/CreateNote"));
const ShowNote = lazy(() => import("./content/ShowNote"));
const NotFound = lazy(() => import("./content/NotFound"));

const Routes = () => (
  <div className="mt-md-4 d-flex flex-column justify-content-center">
    <Suspense fallback={<PageContainer />}>
      <Router>
        <Switch>
          <Route exact path="/" component={ListNotes} />
          <Route path="/note/new" component={CreateNote} />
          <Route path="/notes/:noteId" component={ShowNote} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </Suspense>
  </div>
);

export { Routes };
