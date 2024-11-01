import type { TPluginType } from "@tago-io/tcore-sdk/types";
import ClassTypes from "../../../Plugins/Common/ClassTypes/ClassTypes.tsx";
import MainInformation from "../../../Plugins/Common/MainInformation/MainInformation.tsx";
import Permissions from "../../../Plugins/Common/Permissions/Permissions.tsx";
import Platforms from "../../../Plugins/Common/Platforms/Platforms.tsx";
import * as Style from "./Sidebar.style";

interface ISidebarProps {
  publisherName: string;
  publisherDomain?: string;
  version: string;
  categories: string[];
  permissions: string[];
  platforms: string[];
  /**
   * Date of publish for the plugin.
   */
  publishDate?: string;
  /**
   * Class types used by the plugin.
   */
  classTypes: TPluginType[];
}

/**
 * The banner at the top of the plugin details page.
 */
function Sidebar(props: ISidebarProps) {
  const {
    categories,
    classTypes,
    permissions,
    publishDate,
    publisherName,
    publisherDomain,
    version,
  } = props;

  return (
    <Style.Container>
      <section>
        <h4>Main Information</h4>
        <MainInformation
          publishDate={publishDate}
          publisherName={publisherName}
          publisherDomain={publisherDomain}
          version={version}
        />
      </section>

      {classTypes.length > 0 && (
        <section>
          <h4>Creates</h4>
          <ClassTypes value={classTypes} />
        </section>
      )}

      <section>
        <h4>Permissions</h4>
        <Permissions value={permissions || []} />
      </section>

      {categories.length > 0 && (
        <section>
          <h4>Categories</h4>
          {/* <Categories value={categories} /> */}
        </section>
      )}
    </Style.Container>
  );
}

export default Sidebar;
