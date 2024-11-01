import cloneDeep from "lodash.clonedeep";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import setDocumentTitle from "../../Helpers/setDocumentTitle.ts";
import useApiRequest from "../../Helpers/useApiRequest.ts";
import Button from "../Button/Button.tsx";
import { EButton } from "../Button/Button.types";
import Footer from "../Footer/Footer.tsx";
import type { EIcon } from "../Icon/Icon.types";
import InnerNav from "../InnerNav/InnerNav.tsx";
import Loading from "../Loading/Loading.tsx";
import Tabs from "../Tabs/Tabs.tsx";
import type { ITab } from "../Tabs/Tabs.types";
import * as Style from "./EditPage.style";

/**
 * Props.
 */
interface IEditPageProps<T> {
  /**
   * ID of the resource if the edit page is for a resource.
   *
   * Leave it empty if it's a generic edit page.
   */
  resourceId?: string | undefined;
  /**
   * Color of the tabs and the inner navigation bar.
   */
  color?: string;
  /**
   * Description of the inner navigation bar.
   */
  description?: ReactNode;
  /**
   * Icon of the inner navigation bar.
   */
  icon?: EIcon;
  /**
   * Image of the inner navigation bar. This will override the `icon` prop.
   */
  image?: string;
  /**
   * This is the actual content to be rendered in the middle of the screen.
   * The tabs here follow the same structure as defined in the `Tabs` component.
   */
  tabs: ITab[];
  /**
   * Title of the document/page.
   */
  documentTitle?: string;
  /**
   * Title of the inner navigation bar.
   */
  innerNavTitle?: string;
  /**
   * Indicates if the record is still being loaded.
   * This is useful to specify if the record needs multiple requests before being shown
   * and you want to wait for those requests.
   */
  loading?: boolean;
  /**
   * Request path to retrieve the resource from the backend.
   */
  requestPath?: string;
  /**
   * Controls the selected tab.
   */
  tabIndex: number;
  /**
   * Called when the user presses the `Save` button.
   */
  onSave: () => Promise<void>;
  /**
   * Called when the user presses the `Save` button.
   * This should return a boolean to indicate that something is missing/wrong in the form.
   */
  onValidate?: () => Promise<boolean> | boolean;
  /**
   * Called when the initial data is fetched from the backend.
   */
  onFetch: (data: T) => void;
  /**
   * Optional function to render the right side of the inner navigation bar.
   */
  onRenderInnerNav?: () => ReactNode;
  /**
   * Optional function to render the right side of the footer.
   * Everything returned from this function will be placed on the left side of the `Save` button.
   */
  onRenderFooter?: () => ReactNode;
  /**
   * Function that is called every render to check if the initial data is different from the current data.
   * This is used to disable the `Save` button in case nothing changed.
   */
  onCheckIfDataChanged?: (initialData?: T) => boolean;
  /**
   * Called when the user clicks on another tab.
   */
  onChangeTabIndex: (tabIndex: number) => void;
  /**
   * Optional custom rendering of the inner nav icon.
   */
  onRenderInnerNavIcon?: () => ReactNode;
}

/**
 * This component controls the edit form of the resources in the application.
 */
function EditPage<T>(props: IEditPageProps<T>) {
  const id = props.resourceId;

  const navigate = useNavigate();
  const uniqueID = useRef(Date.now());
  const { requestPath } = props;
  const { data } = useApiRequest<T>(
    `/${requestPath}${id ? `/${id}` : ""}?t=${uniqueID.current}`,
  );
  const [saving, setSaving] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);

  const loaded = useRef(false);

  const {
    documentTitle,
    loading,
    onChangeTabIndex,
    onCheckIfDataChanged,
    onFetch,
    onRenderFooter,
    onRenderInnerNav,
    onSave,
    onValidate,
    tabIndex,
  } = props;

  /**
   * Saves the record.
   */
  const save = async () => {
    const validated = await onValidate?.();
    if (!validated) {
      return;
    }

    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };

  /**
   * Renders the tabs render.
   */
  const renderTabs = () => {
    return (
      <Tabs
        data={props.tabs}
        highlightColor={props.color}
        index={tabIndex}
        loading={saving}
        onChangeIndex={onChangeTabIndex}
      />
    );
  };

  /**
   * Renders the footer with the `Back` and `Save` buttons.
   */
  const renderFooter = () => {
    let saveDisabled = false;

    if (onCheckIfDataChanged && loaded.current) {
      const dataChanged = onCheckIfDataChanged();
      saveDisabled = !dataChanged;
    }

    return (
      <Footer>
        <Button onClick={() => navigate(-1)}>Back</Button>
        <div>
          {onRenderFooter?.()}
          <Button
            onClick={save}
            disabled={saveDisabled || saving}
            type={EButton.primary}
          >
            Save
          </Button>
        </div>
      </Footer>
    );
  };

  /**
   * Renders the inner navigation bar that contains the icon, title and description.
   */
  const renderInnerNav = () => {
    const innerNavTitle = loading ? "" : props.innerNavTitle;
    const description = loading ? "" : props.description;
    return (
      <InnerNav
        color={props.color}
        description={description}
        icon={props.icon}
        onRenderIcon={props.onRenderInnerNavIcon}
        title={innerNavTitle || ""}
      >
        {onRenderInnerNav?.()}
      </InnerNav>
    );
  };

  /**
   */
  useEffect(() => {
    if (loaded.current) {
      setInternalLoading(true);
      uniqueID.current = Date.now();
    }
    loaded.current = false;
  }, [id]);

  /**
   * Used to fetch the record and assign the initial data.
   */
  useEffect(() => {
    if (data && !loaded.current) {
      setInternalLoading(false);
      onFetch(cloneDeep(data));
      loaded.current = true;
    }
  }, [onFetch, id, data]);

  /**
   * Sets the document title.
   */
  useEffect(() => {
    if (documentTitle) {
      setDocumentTitle(documentTitle);
    }
  }, [documentTitle]);

  return (
    <Style.Container>
      {loading || internalLoading ? (
        <Loading />
      ) : (
        <>
          {renderInnerNav()}
          {renderTabs()}
          {renderFooter()}
        </>
      )}
    </Style.Container>
  );
}

export default EditPage;
