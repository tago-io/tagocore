import type { IAnalysis, ILog } from "@tago-io/tcore-sdk/types";
import cloneDeep from "lodash.clonedeep";
import { observer } from "mobx-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMatch } from "react-router";
import { useTheme } from "styled-components";
import normalizeTags from "../../../Helpers/normalizeTags.ts";
import deleteAnalysis from "../../../Requests/deleteAnalysis.ts";
import deleteAnalysisLogs from "../../../Requests/deleteAnalysisLogs.ts";
import editAnalysis from "../../../Requests/editAnalysis.ts";
import runAnalysis from "../../../Requests/runAnalysis.ts";
import { getSocket } from "../../../System/Socket.ts";
import store from "../../../System/Store.ts";
import EditPage from "../../EditPage/EditPage.tsx";
import { EIcon } from "../../Icon/Icon.types";
import Switch from "../../Switch/Switch.tsx";
import TagsTab from "../../Tags/TagsTab.tsx";
import SaveAndRun from "../Common/SaveAndRun/SaveAndRun.tsx";
import AnalysisTab from "./AnalysisTab/AnalysisTab.tsx";
import EnvVarsTab from "./EnvVarsTab/EnvVarsTab.tsx";
import MoreTab from "./MoreTab/MoreTab.tsx";

/**
 * The analysis' edit page.
 */
function AnalysisEdit() {
  const match = useMatch("/console/analysis/:id");
  const id = match?.params?.id;

  const theme = useTheme();
  const [data, setData] = useState<IAnalysis>({} as IAnalysis);
  const [tabIndex, setTabIndex] = useState(0);
  const [errors] = useState<any>({});
  const [saveAndRunDisabled, setSaveAndRunDisabled] = useState(false);
  const [logs, setLogs] = useState<ILog[]>([]);

  const initialData = useRef<IAnalysis>({} as IAnalysis);
  const loading = !data.id;

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

  const onFetch = useCallback((analysis: IAnalysis) => {
    setData(analysis);
    setLogs(analysis.console?.reverse?.() || []);
    initialData.current = cloneDeep(analysis);
  }, []);

  const validate = useCallback(async () => {
    return true;
  }, []);

  const save = useCallback(async () => {
    if (!id) {
      return;
    }

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

  const run = useCallback(async () => {
    if (!id) {
      return;
    }

    setSaveAndRunDisabled(true);
    try {
      await runAnalysis(id);
    } finally {
      setSaveAndRunDisabled(false);
    }
  }, [id]);

  const saveAndRun = useCallback(async () => {
    const dataChanged = checkIfDataChanged();
    if (dataChanged) {
      await save();
      await run();
    } else {
      await run();
    }
  }, [checkIfDataChanged, save, run]);

  const deleteData = useCallback(async () => {
    if (!id) {
      return;
    }

    await deleteAnalysis(id);
  }, [id]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const deleteLogs = useCallback(() => {
    if (!id) {
      return;
    }

    deleteAnalysisLogs(id);
    clearLogs();
  }, [clearLogs, id]);

  const onChangeData = useCallback(
    (field: keyof IAnalysis, value: any) => {
      setData({ ...data, [field]: value });
    },
    [data],
  );

  /**
   * Renders the `Analysis` tab.
   */
  const renderAnalysisTab = () => {
    return (
      <AnalysisTab
        onClearLogs={clearLogs}
        onDeleteLogs={deleteLogs}
        logs={logs}
        data={data}
        onChange={onChangeData}
      />
    );
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
    return (
      <SaveAndRun
        disabled={saveAndRunDisabled}
        onlyRun={onlyRun}
        onClick={saveAndRun}
      />
    );
  }, [saveAndRunDisabled, checkIfDataChanged, saveAndRun]);

  /**
   */
  useEffect(() => {
    function onLog(params: any) {
      setLogs((x) => [params, ...x]);
    }

    getSocket().on("analysis::console", onLog);
    return () => {
      getSocket().off("analysis::console", onLog);
    };
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies(store.socketConnected): mobx observer
  useEffect(() => {
    if (!id) {
      return;
    }

    if (store.socketConnected) {
      getSocket().emit("attach", "analysis", id);
      return () => {
        getSocket().emit("unattach", "analysis", id);
      };
    }
  }, [id, store.socketConnected]);

  return (
    <EditPage<IAnalysis>
      resourceId={id}
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
