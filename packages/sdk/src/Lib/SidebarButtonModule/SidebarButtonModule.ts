import TCoreModule from "../TCoreModule/TCoreModule.ts";

/**
 * This module allows a plugin to create a sidebar button inside of tagocore.
 * ! only available internally to certain plugins developed by TagoIO.
 */
class SidebarButtonModule extends TCoreModule {
  constructor(protected setup: any) {
    super(setup, "sidebar-button");
  }
}

export default SidebarButtonModule;
