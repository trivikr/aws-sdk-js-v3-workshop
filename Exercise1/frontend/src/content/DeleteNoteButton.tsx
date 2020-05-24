import { navigate } from "@reach/router";
import React, { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { ButtonSpinner } from "../components";
import { GATEWAY_URL } from "../config.json";
import { deleteObject } from "../libs";

const DeleteNoteButton = (props: { noteId: string; attachment?: string }) => {
  const { noteId, attachment } = props;
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = async (event: any) => {
    event.preventDefault();
    setIsDeleting(true);

    const deleteNoteURL = `${GATEWAY_URL}notes/${noteId}`;

    try {
      if (attachment) {
        await deleteObject(attachment);
      }
      await fetch(deleteNoteURL, {
        method: "DELETE",
      });
      navigate("/");
    } catch (error) {
      setErrorMsg(`${error.toString()} - ${deleteNoteURL} - ${noteId}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Button
        variant="danger"
        disabled={isDeleting}
        onClick={handleDelete}
        block
      >
        {isDeleting ? <ButtonSpinner /> : ""}
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </>
  );
};

export { DeleteNoteButton };
