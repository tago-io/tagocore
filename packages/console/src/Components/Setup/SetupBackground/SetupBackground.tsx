import { EIcon, Icon } from "../../../index.ts";
import * as Style from "./SetupBackground.style";

/**
 * Background showing "building blocks" of the system, such as devices, buckets,
 * plugins and etc.
 */
function SetupBackground() {
  return (
    <Style.Container>
      <div className="inner">
        <div className="col">
          <div className="row">
            <Style.Small>
              <Icon icon={EIcon.bolt} size="100px" />
            </Style.Small>

            <Style.Small>
              <Icon icon={EIcon.code} size="100px" />
            </Style.Small>
          </div>

          <Style.Device>
            <Icon icon={EIcon["device-union"]} size="350px" />
          </Style.Device>
        </div>

        <div>
          <Style.Bucket1>
            <Icon icon={EIcon["puzzle-piece"]} size="700px" />
          </Style.Bucket1>

          <Style.Bucket2>
            <Icon icon={EIcon.bucket} size="700px" />
          </Style.Bucket2>
        </div>

        <div className="col" style={{ marginLeft: "20px", marginTop: "-700px" }}>
          <div className="row">
            <Style.Small>
              <Icon icon={EIcon.cube} size="100px" />
            </Style.Small>

            <Style.Small>
              <Icon icon={EIcon.download} size="100px" />
            </Style.Small>

            <Style.Small>
              <Icon icon={EIcon["puzzle-piece"]} size="100px" />
            </Style.Small>

            <Style.Small>
              <Icon icon={EIcon.code} size="100px" />
            </Style.Small>
          </div>

          <Style.Device>
            <Icon icon={EIcon["puzzle-piece"]} size="350px" />
          </Style.Device>
        </div>
      </div>
    </Style.Container>
  );
}

export default SetupBackground;
