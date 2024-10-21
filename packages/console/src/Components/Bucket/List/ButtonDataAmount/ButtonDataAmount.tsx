import type { IDevice } from "@tago-io/tcore-sdk/types";
import { useState } from "react";
import { formatDataAmount } from "../../../../Helpers/formatDataAmount.ts";
import getDeviceDataAmount from "../../../../Requests/getDeviceDataAmount.ts";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import * as Style from "./ButtonDataAmount.style";

/**
 * Props.
 */
interface IButtonDataAmountProps {
  /**
   * Device object.
   */
  device: IDevice;
}

/**
 * This is the button rendered in the `Data amount` column of each bucket row.
 * It fetches the amount of data in the device when clicked.
 */
function ButtonDataAmount(props: IButtonDataAmountProps) {
  const [value, setValue] = useState<number>();
  const [loading, setLoading] = useState(false);
  const { device } = props;

  /**
   * Fetches the amount of data in the device and then re-renders this component.
   */
  async function fetchAmount() {
    try {
      setLoading(true);
      const response = await getDeviceDataAmount(device.id);
      setValue(response);
    } finally {
      setLoading(false);
    }
  }

  if (value !== undefined) {
    return <>{formatDataAmount(value)}</>;
  }

  return (
    <Style.Container
      addIconMargin
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!loading) {
          fetchAmount();
        }
      }}
    >
      {!loading && <Icon icon={EIcon["question-circle"]} />}
      <span>{loading ? "Loading..." : "Show amount"}</span>
    </Style.Container>
  );
}

export default ButtonDataAmount;
