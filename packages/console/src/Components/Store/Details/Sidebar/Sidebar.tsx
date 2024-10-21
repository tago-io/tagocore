import type { TPluginType } from "@tago-io/tcore-sdk/types";
import MainInformation from "../../../Plugins/Common/MainInformation/MainInformation.tsx";
import Platforms from "../../../Plugins/Common/Platforms/Platforms.tsx";
import ClassTypes from "../../../Plugins/Common/ClassTypes/ClassTypes.tsx";
import Permissions from "../../../Plugins/Common/Permissions/Permissions.tsx";
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
    platforms,
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

      <section>
        <h4>Runs on</h4>
        <Platforms value={platforms || []} />
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
