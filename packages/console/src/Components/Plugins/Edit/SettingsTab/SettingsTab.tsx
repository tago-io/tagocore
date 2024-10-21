import type { IModuleSetup, IPlugin, IPluginModule } from "@tago-io/tcore-sdk/types";
import { useTheme } from "styled-components";
import FormDivision from "../../../FormDivision/FormDivision.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Markdown from "../../../Markdown/Markdown.tsx";
import Buttons from "../Buttons/Buttons.tsx";
import EmptyMessage from "../../../EmptyMessage/EmptyMessage.tsx";
import MainInformation from "../../Common/MainInformation/MainInformation.tsx";
import ModuleSetup from "../../Common/ModuleSetup/ModuleSetup.tsx";
import { Button, Icon } from "../../../../index.ts";
import Status from "../../Common/Status/Status.tsx";
import * as Style from "./SettingsTab.style";

/**
 */
interface ISettingsTab {
  /**
   * Plugin's form data.
   */
  data: IPlugin;
  /**
   * Called when the user confirm the uninstall.
   */
  onUninstall: (keepData: boolean) => Promise<void>;
  /**
   * The value for the fields.
   */
  values: any;
  /**
   * Called when a value of a field changes.
   */
  onChangeValues: (values: any) => void;
  /**
   * Called when a module gets started.
   */
  onStartModule: (module: IPluginModule) => Promise<void>;
  /**
   * Called when a module gets stopped.
   */
  onStopModule: (module: IPluginModule) => Promise<void>;
  /**
   * Called when the plugin gets enabled.
   */
  onEnable: () => Promise<void>;
  /**
   * Called when the plugin gets disabled.
   */
  onDisable: () => Promise<void>;
  /**
   * The errors for the fields.
   */
  errors: any;
}

/**
 */
function SettingsTab(props: ISettingsTab) {
  const theme = useTheme();
  const {
    data,
    errors,
    values,
    onEnable,
    onDisable,
    onStartModule,
    onStopModule,
    onChangeValues,
  } = props;

  /**
   * Returns the icon for a type of plugin.
   */
  const getIcon = (setup: IModuleSetup): EIcon => {
    switch (setup.type) {
      case "database":
        return EIcon.database;
      case "action-trigger":
        return EIcon.bolt;
      case "action-type":
        return EIcon.bolt;
      case "service":
        return EIcon.cog;
      default:
        return EIcon.cog;
    }
  };

  const renderModuleSummary = () => {
    if (data.modules.length === 0) {
      return null;
    }

    return (
      <Style.ModuleSummary>
        <FormDivision title="Modules" />
        <div className="items">
          {data.modules.map((x) => (
            <div className="item" key={x.id}>
              <Icon icon={getIcon(x)} size="15px" />
              <div className="info">
                <span className="name">{x.name}</span>
                <span className="type">{x.type}</span>
              </div>
            </div>
          ))}
        </div>
      </Style.ModuleSummary>
    );
  };

  const renderStatus = () => {
    return (
      <Style.Status>
        {data.state === "disabled" ? (
          <Status
            color="rgba(0, 0, 0, 0.05)"
            icon={EIcon["exclamation-circle"]}
            iconColor="rgba(0, 0, 0, 0.5)"
            value={"This plugin is disabled"}
            key="disabled"
          />
        ) : data.error ? (
          <Status
            color={theme.errorStatus}
            icon={EIcon["exclamation-triangle"]}
            iconColor={theme.errorStatusIcon}
            title="Unexpected Plugin shutdown"
            value={`${data.error}`}
            key="error"
          >
            <Button addIconMargin onClick={onEnable}>
              {data.state === "stopping" || data.state === "starting" ? (
                <>
                  <Icon icon={EIcon.redo} />
                  <span>Reloading...</span>
                </>
              ) : (
                <>
                  <Icon icon={EIcon.redo} />
                  <span>Reload Plugin</span>
                </>
              )}
            </Button>
          </Status>
        ) : null}
      </Style.Status>
    );
  };

  /**
   */
  const renderLeftSectionContent = () => {
    return (
      <>
        <div className="first-section">
          <div className="main-info-container">
            <FormDivision title="Main Information" />
            <MainInformation
              publisherName={data.publisher?.name || "Unknown"}
              publisherDomain={data.publisher?.domain}
              version={data.version}
              state={data.state}
            />
          </div>

          <div className="buttons-container">
            <Buttons
              data={data}
              onDisable={onDisable}
              onEnable={onEnable}
            />
          </div>
        </div>

        {renderModuleSummary()}

        <FormDivision renderBorder title="Description" />

        <div className="markdown-container">
          {data?.full_description ? (
            <Markdown localImgPrefix={`/images2/${data.id}`} value={data?.full_description} />
          ) : (
            <EmptyMessage icon={EIcon.list} message="No information available." />
          )}
        </div>
      </>
    );
  };

  /**
   */
  const renderConfigs = () => {
    return (
      <div>
        {data.modules.map((x) => (
          <ModuleSetup
            data={data}
            errors={errors}
            key={x.id}
            module={x}
            onChangeValues={onChangeValues}
            onStart={onStartModule}
            onStop={onStopModule}
            values={values}
          />
        ))}
      </div>
    );
  };

  return (
    <Style.Container>
      {renderStatus()}
      <div className="content">
        <div className="horizontal">
          <Style.LeftSection>{renderLeftSectionContent()}</Style.LeftSection>
          {data.modules.length > 0 && <Style.RightSection>{renderConfigs()}</Style.RightSection>}
        </div>
      </div>
    </Style.Container>
  );
}

export default SettingsTab;
