import { getSystemName } from "@tago-io/tcore-shared";
import { useState } from "react";
import { EIcon, Icon } from "../../../index.ts";
import * as Style from "./Welcome.style";

const tips = [
  "You can use an Action to trigger an Analysis",
  "You can use the Plugin Store to download plugins",
  "Data from Devices is stored in Buckets",
  "You can view all data in a Bucket by clicking the Variables tab",
];

/**
 * Welcome screen for the login, located on the left side of the form.
 */
function Welcome() {
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);

  return (
    <Style.Container className="welcome">
      <span>Welcome to</span>
      <h1>{getSystemName()}</h1>

      <section>
        <Icon icon={EIcon.lightbulb} />
        <span>Tip: {tip}</span>
      </section>
    </Style.Container>
  );
}

export default Welcome;
