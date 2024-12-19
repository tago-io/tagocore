import type { IComputerUsage } from "@tago-io/tcore-sdk/types";
import Icon from "../../Icon/Icon.tsx";
import { EIcon } from "../../Icon/Icon.types";
import Loading from "../../Loading/Loading.tsx";
import * as Style from "./ComputerUsage.style";

interface IComputerUsageProps {
  usages: IComputerUsage[] | null;
}

function ComputerUsage(props: IComputerUsageProps) {
  const { usages } = props;
  if (!usages) {
    return <Loading />;
  }

  const getIcon = (type: string) => {
    if (type === "memory") {
      return EIcon.memory;
    }
    if (type === "cpu") {
      return EIcon.microchip;
    }
    if (type === "disk") {
      return EIcon.hdd;
    }
    if (type === "battery") {
      return EIcon["battery-full"];
    }
    return EIcon.cog;
  };

  return (
    <Style.Container>
      {usages.map((usage) => {
        const {
          title,
          description,
          type,
          detail,
          // defaults for `used` and `total` to prevent `undefined` or division by zero
          used = 0,
          total = 100,
        } = usage;

        const percent = Math.floor((used / total) * 100);

        return (
          <Style.Item key={title}>
            <Icon size="40px" icon={getIcon(type)} />

            <div className="data">
              <h3>{title}</h3>

              <div className="bar-container">
                <Style.Bar value={percent || 0} />
                <span>{percent}%</span>
              </div>

              <span className="description">
                {detail}
                {detail && description ? " • " : ""}
                {description}
              </span>
            </div>
          </Style.Item>
        );
      })}
      <div className="space" />
    </Style.Container>
  );
}

export default ComputerUsage;
