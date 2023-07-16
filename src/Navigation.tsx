import React from "react";
import {
  Alignment,
  AnchorButton,
  Classes,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Switch,
} from "@blueprintjs/core";
import blueprintLogo from "./assets/blueprint-logo.png";

interface NavigationProps {

}

export const Navigation: React.FC<NavigationProps> = ({ }) => {
  return (
    <Navbar >
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>
          <img
            src={blueprintLogo}
            className="logo"
            alt="Blueprint logo"
            height={20}
            width={20}
          />
          <span>Graph Toolkit</span>
        </NavbarHeading>
        <NavbarDivider />
        <AnchorButton
          href="https://github.com/ksipma/graph-toolkit"
          text="Github"
          target="_blank"
          minimal
          rightIcon="share"
        />
        <AnchorButton
          href="https://blueprintjs.com/docs/"
          text="Blueprintjs"
          target="_blank"
          minimal
          rightIcon="share"
        />
        <AnchorButton
          href="https://docs.rapids.ai/api/cugraph/stable/"
          text="CuGraph"
          target="_blank"
          minimal
          rightIcon="share"
        />
        <AnchorButton
          href="https://github.com/vasturiano/react-force-graph"
          text="React Force Graph"
          target="_blank"
          minimal
          rightIcon="share"
        />
        <AnchorButton
          href="https://www.graphistry.com/"
          text="Graphistry"
          target="_blank"
          minimal
          rightIcon="share"
        />
        <NavbarDivider />
      </NavbarGroup>
    </Navbar>
  );
};
