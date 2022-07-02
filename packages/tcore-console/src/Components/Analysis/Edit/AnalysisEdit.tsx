import { ESocketResource, IAnalysis, ILog } from "@tago-io/tcore-sdk/types";
import cloneDeep from "lodash.clonedeep";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouteMatch } from "react-router";
import { useTheme } from "styled-components";
import { observer } from "mobx-react";
import normalizeTags from "../../../Helpers/normalizeTags";
import EditPage from "../../EditPage/EditPage";
import { EIcon } from "../../Icon/Icon.types";
import Switch from "../../Switch/Switch";
import SaveAndRun from "../Common/SaveAndRun/SaveAndRun";
import TagsTab from "../../Tags/TagsTab";
import deleteAnalysis from "../../../Requests/deleteAnalysis";
import editAnalysis from "../../../Requests/editAnalysis";
import runAnalysis from "../../../Requests/runAnalysis";
import store from "../../../System/Store";
import { getSocket } from "../../../System/Socket";
import AnalysisTab from "./AnalysisTab/AnalysisTab";
import EnvVarsTab from "./EnvVarsTab/EnvVarsTab";
import MoreTab from "./MoreTab/MoreTab";

/**
 * The analysis' edit page.
 */
function AnalysisEdit() {
  const match = useRouteMatch<{ id: string }>();
  const { id } = match.params;

  const theme = useTheme();
  const [data, setData] = useState<IAnalysis>({} as IAnalysis);
  const [tabIndex, setTabIndex] = useState(0);
  const [errors] = useState<any>({});
  const [saveAndRunDisabled, setSaveAndRunDisabled] = useState(false);
  const [logs, setLogs] = useState<ILog[]>([]);

  const initialData = useRef<IAnalysis>({} as IAnalysis);
  const loading = !data.id;

  /**
   * Should return if the initial data is different from the current data.
   */
  const checkIfDataChanged = useCallback(() => {
    const initialDataNorm = {
      ...initialData.current,
      tags: normalizeTags(initialData.current.tags),
      variables: normalizeTags(initialData.current.variables || []),
    };
    const currentDataNorm = {
      ...data,
      tags: normalizeTags(data.tags),
      variables: normalizeTags(data.variables || []),
    };

    return JSON.stringify(initialDataNorm) !== JSON.stringify(currentDataNorm);
  }, [data]);

  /**
   * Called when the record was fetched by the edit page.
   * We use this to set the data state to manipulate the object.
   */
  const onFetch = useCallback((analysis: IAnalysis) => {
    setData(analysis);
    setLogs(analysis.console?.reverse?.() || []);
    initialData.current = cloneDeep(analysis);
  }, []);

  /**
   * Validates the form data to make sure the object is not faulty.
   * This should return a boolean to indicate if the data is correct or not.
   */
  const validate = useCallback(async () => {
    return true;
  }, []);

  /**
   * Saves the analysis.
   */
  const save = useCallback(async () => {
    setSaveAndRunDisabled(true);
    try {
      const formatted = {
        active: data.active,
        binary_path: data.binary_path,
        file_path: data.file_path,
        id: data.id,
        name: data.name,
        options: data.options,
        tags: normalizeTags(data.tags),
        variables: normalizeTags(data.variables || []),
      };

      await editAnalysis(id, formatted);

      initialData.current = cloneDeep(data);
    } finally {
      setSaveAndRunDisabled(false);
    }
  }, [id, data]);

  /**
   * Runs the analysis.
   */
  const run = useCallback(async () => {
    setSaveAndRunDisabled(true);
    try {
      await runAnalysis(id);
    } finally {
      setSaveAndRunDisabled(false);
    }
  }, [id]);

  /**
   * Saves and runs the analysis.
   */
  const saveAndRun = useCallback(async () => {
    const dataChanged = checkIfDataChanged();
    if (dataChanged) {
      await save();
      await run();
    } else {
      await run();
    }
  }, [checkIfDataChanged, save, run]);

  /**
   * Deletes the analysis.
   */
  const deleteData = useCallback(async () => {
    await deleteAnalysis(id);
  }, [id]);

  /**
   * Clears the logs.
   */
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  /**
   * Called when a field from a tab gets modified.
   * This will apply the change to the data state.
   */
  const onChangeData = useCallback(
    (field: keyof IAnalysis, value) => {
      setData({ ...data, [field]: value });
    },
    [data]
  );

  /**
   * Renders the `Analysis` tab.
   */
  const renderAnalysisTab = () => {
    return <AnalysisTab onClearLogs={clearLogs} logs={logs} data={data} onChange={onChangeData} />;
  };

  /**
   * Renders the `Environment Variables` tab.
   */
  const renderEnvVarsTab = () => {
    return <EnvVarsTab data={data} onChange={onChangeData} />;
  };

  /**
   * Renders the `Tags` tab.
   */
  const renderTagsTab = () => {
    return (
      <TagsTab
        data={data.tags}
        errors={errors?.tags}
        name="analyses"
        onChange={(tags) => onChangeData("tags", tags)}
      />
    );
  };

  /**
   * Renders the `More` tab.
   */
  const renderMoreTab = () => {
    return <MoreTab onDelete={deleteData} data={data} />;
  };

  /**
   * Renders the right side of the inner nav.
   */
  const renderInnerNav = useCallback(() => {
    if (loading) {
      // still loading
      return null;
    }

    return (
      <Switch value={data.active} onChange={(e) => onChangeData("active", e)}>
        Active
      </Switch>
    );
  }, [loading, onChangeData, data]);

  /**
   * Renders the `Footer` tab.
   */
  const renderFooter = useCallback(() => {
    const dataChanged = checkIfDataChanged();
    const onlyRun = !dataChanged;
    return <SaveAndRun disabled={saveAndRunDisabled} onlyRun={onlyRun} onClick={saveAndRun} />;
  }, [saveAndRunDisabled, checkIfDataChanged, saveAndRun]);

  /**
   */
  useEffect(() => {
    function onLog(params: any) {
      setLogs((x) => [params, ...x]);
    }

    getSocket().on(`analysis:log:${id}`, onLog);
    return () => {
      getSocket().off(`analysis:log:${id}`, onLog);
    };
  });

  /**
   */
  useEffect(() => {
    if (store.socketConnected) {
      getSocket().emit("attach", ESocketResource.analysis);
      return () => {
        getSocket().emit("unattach", ESocketResource.analysis);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.socketConnected]);

  return (
    <EditPage<IAnalysis>
      color={theme.analysis}
      documentTitle="Analysis"
      icon={EIcon.code}
      innerNavTitle={data.name || "Analysis"}
      loading={loading}
      onChangeTabIndex={setTabIndex}
      onCheckIfDataChanged={checkIfDataChanged}
      onFetch={onFetch}
      onRenderFooter={renderFooter}
      onRenderInnerNav={renderInnerNav}
      onSave={save}
      onValidate={validate}
      requestPath="analysis"
      tabIndex={tabIndex}
      tabs={[
        {
          label: "Analysis",
          content: renderAnalysisTab(),
        },
        {
          label: "Environment Variables",
          content: renderEnvVarsTab(),
        },
        {
          label: "Tags",
          content: renderTagsTab(),
        },
        {
          label: "More",
          content: renderMoreTab(),
        },
      ]}
    />
  );
}

export default observer(AnalysisEdit);
