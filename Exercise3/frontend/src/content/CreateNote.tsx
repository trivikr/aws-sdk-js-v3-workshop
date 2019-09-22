import React, { useState, FormEvent } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { navigate, RouteComponentProps } from "@reach/router";
import { config } from "../config";
import { HomeButton, ButtonSpinner, PageContainer } from "../components";

const CreateNote = (props: RouteComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [noteContent, setNoteContent] = useState("");
  const [file, setFile] = useState();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (file && file.size > config.MaxFileSize) {
      setErrorMsg(
        `File can't be bigger than ${config.MaxFileSize / 1000000} MB`
      );
      return;
    }

    setIsLoading(true);

    let attachment;
    if (file) {
      const putObjectUrl = `${config.GatewayURL}/files`;
      try {
        const formData = new FormData();
        formData.append("file", file);
        attachment = await fetch(putObjectUrl, {
          method: "POST",
          // headers: {
          //   "Access-Control-Allow-Origin": "*",
          //   "Access-Control-Allow-Headers":
          //     "Origin, X-Requested-With, Content-Type, Accept",
          //   "Access-Control-Allow-Methods": "GET, POST, PUT"
          // },
          body: formData
        });
      } catch (error) {
        setErrorMsg(`${error.toString()} - ${putObjectUrl}`);
        return;
      }
    }

    const createNoteURL = `${config.GatewayURL}/notes`;

    try {
      await fetch(createNoteURL, {
        method: "POST",
        body: JSON.stringify({ attachment, content: noteContent })
      });
      navigate("/");
    } catch (error) {
      setErrorMsg(`${error.toString()} - ${createNoteURL} - ${noteContent}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer header={<HomeButton />}>
      <form onSubmit={handleSubmit}>
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        <Form.Group controlId="content">
          <Form.Label>Note Content</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter Note content"
            onChange={e => {
              const content = e.currentTarget.value;
              if (content) {
                setNoteContent(content);
              }
            }}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control
            // @ts-ignore
            onChange={e => {
              setFile(e.target.files[0]);
            }}
            type="file"
          />
        </Form.Group>
        <Button type="submit" disabled={!noteContent || isLoading} block>
          {isLoading ? <ButtonSpinner /> : ""}
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </form>
    </PageContainer>
  );
};

export default CreateNote;
