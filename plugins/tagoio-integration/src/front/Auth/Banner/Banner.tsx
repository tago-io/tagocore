import { EIcon, Icon } from "@tago-io/tcore-console";
import * as Style from "./Banner.style";

function Banner() {
  return (
    <Style.Container className="banner">
      <h2>
        Get the best of both worlds
        <br />
        <span>Link your TagoIO Cloud account with your TagoCore.</span>
      </h2>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "calc(50% + 40px)",
          opacity: 0.13,
          transform: "translate(-50%, -50%) rotate(0deg)",
        }}
      >
        <Icon icon={EIcon.globe} color="white" size="350px" />
      </div>

      <div className="block">
        <Icon icon={EIcon.io} color="white" size="130px" />
      </div>
      <div className="connection">
        <Icon icon={EIcon["caret-down"]} color="white" size="60px" />
        <Icon icon={EIcon["caret-up"]} color="white" size="60px" />
      </div>
      <div className="block">
        <Icon icon={EIcon.tcore} color="white" size="130px" />
      </div>
      {/* biome-ignore lint/a11y/useHeadingContent: <explanation> */}
      <h2 />
    </Style.Container>
  );
}

export default Banner;
