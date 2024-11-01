import type { ISettings, ISettingsMetadata } from "@tago-io/tcore-sdk/types";
import { getSystemName } from "@tago-io/tcore-shared";
import { observer } from "mobx-react";
import { useState } from "react";
import useApiRequest from "../../../../Helpers/useApiRequest.ts";
import store from "../../../../System/Store.ts";
import { Button, EButton, Icon } from "../../../../index.ts";
import Col from "../../../Col/Col.tsx";
import FormDivision from "../../../FormDivision/FormDivision.tsx";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input.tsx";
import ModalFactoryReset from "../../../Plugins/Common/ModalFactoryReset/ModalFactoryReset.tsx";
import ModalMasterPassword from "../../../Plugins/Common/ModalMasterPassword/ModalMasterPassword.tsx";
import Row from "../../../Row/Row.tsx";
import Select, { type ISelectOption } from "../../../Select/Select.tsx";
import * as Style from "./GeneralInformationTab.style";

/**
 * Props.
 */
interface IGeneralInformationTabProps {
  /**
   * Settings' form data.
   */
  data: ISettings;
  /**
   * Called when a field is changed.
   */
  onChange: (field: keyof ISettings, value: ISettings[keyof ISettings]) => void;
  /**
   * Settings's form errors.
   */
  errors: any;
  /**
   */
  metadata?: ISettingsMetadata;
}

/**
 * The settings' `General Information` tab.
 */
function GeneralInformationTab(props: IGeneralInformationTabProps) {
  const [resetting, setResetting] = useState(false);
  const { data: databaseList } = useApiRequest<any[]>("/module?type=database");
  const { data: queueList } = useApiRequest<any[]>("/module?type=queue");
  const { data: filesystemList } = useApiRequest<any[]>(
    "/module?type=filesystem",
  );
  const { data, metadata, errors } = props;

  /**
   * Gets a list of database options based on the backend list.
   */
  const getDatabaseOptions = () => {
    const options: ISelectOption[] = [
      { label: "Default (first one loaded)", value: "" },
    ];
    for (const item of databaseList || []) {
      options.push({
        label: item.setupName,
        value: `${item.pluginID}:${item.setupID}`,
      });
    }
    return options;
  };

  /**
   * Gets a list of database options based on the backend list.
   */
  const getQueueOptions = () => {
    const options: ISelectOption[] = [{ label: "None", value: "" }];
    for (const item of queueList || []) {
      options.push({
        label: item.setupName,
        value: `${item.pluginID}:${item.setupID}`,
      });
    }
    return options;
  };

  /**
   * Gets a list of filesystem options based on the backend list.
   */
  const getFilesystemOptions = () => {
    const options: ISelectOption[] = [];
    for (const item of filesystemList || []) {
      options.push({
        label: item.setupName,
        value: `${item.pluginID}:${item.setupID}`,
      });
    }
    if (!filesystemList) {
      options.unshift({ label: "-", value: "-" });
    }
    return options;
  };

  return (
    <div>
      <Row>
        <Col size="6">
          <FormDivision icon={EIcon.cog} title="General Information" />

          <FormGroup
            tooltip="The location in the server's filesystem where the settings will reside."
            icon={EIcon.folder}
            label="Settings folder"
          >
            <Input disabled readOnly value={data.settings_folder || ""} />
          </FormGroup>

          <FormGroup
            tooltip="The port that the application will run. By default it is 8888."
            icon={EIcon["pencil-alt"]}
            label="Port"
          >
            <Input
              error={errors?.port}
              onChange={(e) => props.onChange("port", e.target.value)}
              placeholder="8888"
              type="number"
              disabled={metadata?.port_disabled}
              value={data.port || ""}
            />
          </FormGroup>

          <fieldset>
            <legend>
              <Icon icon={EIcon["exclamation-triangle"]} />
              <span>Danger zone</span>
            </legend>

            <FormGroup>
              <Style.DangerZone>
                <div className="info">
                  <b>Perform a factory reset</b>
                  <span>
                    A Factory reset will remove settings, plugins, and plugin
                    files.
                  </span>
                </div>

                <Button
                  onClick={() => setResetting(true)}
                  type={EButton.danger}
                >
                  Factory reset
                </Button>
              </Style.DangerZone>
            </FormGroup>
          </fieldset>
        </Col>

        <Col size="6">
          <FormDivision icon={EIcon["puzzle-piece"]} title="Plugin Settings" />
          <FormGroup
            tooltip={`The plugin that will be used as the main database for ${getSystemName()}.`}
            icon={EIcon.database}
            label="Database plugin"
          >
            <Select
              onChange={(e) =>
                props.onChange("database_plugin", e.target.value)
              }
              placeholder="Select the default database plugin"
              value={data.database_plugin}
              error={errors?.database_plugin}
              errorMessage="This field is required"
              options={getDatabaseOptions()}
              disabled
            />
          </FormGroup>

          <FormGroup
            tooltip={`The plugin that will be used as the main queue for ${getSystemName()}.`}
            icon={EIcon.list}
            label="Queue plugin"
          >
            <Select
              onChange={(e) => props.onChange("queue_plugin", e.target.value)}
              placeholder="Select the default queue plugin"
              value={data.queue_plugin}
              error={errors?.queue_plugin}
              options={getQueueOptions()}
              disabled={!queueList?.length}
            />
          </FormGroup>

          <FormGroup
            tooltip={`The plugin that will be used as the main filesystem for ${getSystemName()}.`}
            icon={EIcon.folder}
            label="Filesystem plugin"
          >
            <Select
              onChange={(e) =>
                props.onChange("filesystem_plugin", e.target.value)
              }
              placeholder="Select the default filesystem plugin"
              value={data.filesystem_plugin}
              error={errors?.filesystem_plugin}
              errorMessage="This field is required"
              options={getFilesystemOptions()}
            />
          </FormGroup>
        </Col>
      </Row>

      {resetting && store.masterPassword && (
        <ModalFactoryReset
          onClose={() => {
            store.masterPassword = "";
            setResetting(false);
          }}
        />
      )}

      {resetting && !store.masterPassword && (
        <ModalMasterPassword onClose={() => setResetting(false)} />
      )}
    </div>
  );
}

export default observer(GeneralInformationTab);
