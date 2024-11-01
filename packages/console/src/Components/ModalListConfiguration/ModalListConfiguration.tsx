import type { TGenericID } from "@tago-io/tcore-sdk/types";
import { useEffect, useState } from "react";
import {
  getLocalStorageAsJSON,
  setLocalStorageAsJSON,
} from "../../Helpers/localStorage.ts";
import { Switch } from "../../index.ts";
import Modal from "../Modal/Modal.tsx";
import Select from "../Select/Select.tsx";
import * as Style from "./ModalListConfiguration.style";

/**
 * Props.
 */
interface IModalListConfigurationProps {
  visible?: boolean;
  /**
   */
  deviceID: TGenericID;
  /**
   */
  onClose: (data: any) => void;
}

/**
 */
function ModalListConfiguration(props: IModalListConfigurationProps) {
  const { deviceID, onClose } = props;

  const [dateFormat, setDateFormat] = useState(() => {
    const data = getLocalStorageAsJSON(`${deviceID}::data::settings`);
    return data?.dateFormat || "";
  });
  const [enabledColumns, setEnabledColumns] = useState<any>(() => {
    const data = getLocalStorageAsJSON(`${deviceID}::data::settings`);
    return data?.enabledColumns || {};
  });

  /**
   */
  const renderItem = (id: string, text: string) => {
    const enabled = enabledColumns[id] ?? true;
    return (
      <div className="item">
        <Switch
          value={enabled}
          onChange={(e) => setEnabledColumns({ ...enabledColumns, [id]: e })}
        >
          {text}
        </Switch>
      </div>
    );
  };

  /**
   */
  useEffect(() => {
    setLocalStorageAsJSON(`${deviceID}::data::settings`, {
      dateFormat,
      enabledColumns,
    });
  });

  return (
    <Modal
      onClose={() => onClose({ dateFormat, enabledColumns })}
      showCancelButton={false}
      showConfirmButton={false}
      title="List Configuration"
      width="550px"
    >
      <Style.Container>
        <section>
          <h2>Hide/Show Columns</h2>
          {renderItem("id", "ID")}
          {renderItem("variable", "Variable")}
          {renderItem("value", "Value")}
          {renderItem("location", "Location")}
          {renderItem("group", "Group")}
          {renderItem("metadata", "Metadata")}
          {renderItem("time", "Time")}
        </section>

        <section>
          <h2>Time Format</h2>
          <Select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            options={[
              { label: "Relative", value: "relative" },
              {
                label: "MM-DD-YYYY hh:mm:ss.SSS a",
                value: "yyyy-MM-dd hh:mm:ss.SSS a",
              },
              {
                label: "DD/MM/YYYY HH:mm:ss.SSS",
                value: "dd/MM/yyyy HH:mm:ss.SSS",
              },
              {
                label: "YYYY-MM-DD HH:mm:ss.SSS",
                value: "yyyy-MM-dd HH:mm:ss.SSS",
              },
            ]}
          />
        </section>
      </Style.Container>
    </Modal>
  );
}

export default ModalListConfiguration;
