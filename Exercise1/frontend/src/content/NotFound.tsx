import { RouteComponentProps } from "@reach/router";
import React from "react";
import { HomeButton, PageContainer } from "../components";

const NotFound = (props: RouteComponentProps) => (
  <PageContainer header={<HomeButton />}>404 Page Not Found</PageContainer>
);

export { NotFound };
