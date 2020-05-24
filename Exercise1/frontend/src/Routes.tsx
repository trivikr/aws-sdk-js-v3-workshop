import { Router } from "@reach/router";
import React from "react";
import { CreateNote, ListNotes, NotFound, ShowNote } from "./content";

const Routes = () => (
  <Router className="mt-md-4 d-flex flex-column justify-content-center">
    <ListNotes path="/" />
    <CreateNote path="/note/new" />
    <ShowNote path="/notes/:noteId" />
    <NotFound default />
  </Router>
);

export { Routes };
