import type { IAnalysis } from "@tago-io/tcore-sdk/types";
import { useState } from "react";
import { useTheme } from "styled-components";
import getAnalysisList from "../../../Requests/getAnalysisList.ts";
import BooleanStatus from "../../BooleanStatus/BooleanStatus.tsx";
import Button from "../../Button/Button.tsx";
import { EButton } from "../../Button/Button.types";
import Icon from "../../Icon/Icon.tsx";
import { EIcon } from "../../Icon/Icon.types";
import ListPage from "../../ListPage/ListPage.tsx";
import RelativeDate from "../../RelativeDate/RelativeDate.tsx";
import ModalAddAnalysis from "../Common/ModalAddAnalysis/ModalAddAnalysis.tsx";

/**
 * The device edit page.
 */
function AnalysisList() {
  const [modal, setModal] = useState(false);
  const theme = useTheme();

  return (
    <>
      <ListPage<IAnalysis>
        color={theme.analysis}
        description="Implement scripts to analyze and manipulate data in real-time."
        icon={EIcon.code}
        path="analysis"
        innerNavTitle="Analysis"
        documentTitle="Analysis"
        onGetData={getAnalysisList}
        summaryKey="analysis"
        columns={[
          {
            id: "name",
            label: "Name",
            onRender: (item) => item.name,
            type: "text",
          },
          {
            flex: "none",
            id: "active",
            label: "Active",
            onRender: (item) => <BooleanStatus value={item.active} />,
            type: "boolean",
            width: 100,
          },
          {
            id: "last_run",
            label: "Last run",
            onRender: (item) => <RelativeDate value={item.last_run} />,
            type: "date",
          },
          {
            id: "created_at",
            label: "Created at",
            onRender: (item) => <RelativeDate value={item.created_at} />,
            type: "date",
          },
        ]}
      >
        <Button
          addIconMargin
          color={theme.analysis}
          onClick={() => setModal(true)}
          type={EButton.primary}
        >
          <Icon icon={EIcon.plus} />
          <span>Add Analysis</span>
        </Button>
      </ListPage>

      {modal && <ModalAddAnalysis onClose={() => setModal(false)} />}
    </>
  );
}

export default AnalysisList;
