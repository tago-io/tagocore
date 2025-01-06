import TCoreModule from "../TCoreModule/TCoreModule.ts";

/**
 * This module allows the creation of a page inside tagocore with HTML and CSS.
 * ! only available internally to certain plugins developed by TagoIO.
 */
class PageModule extends TCoreModule {
  constructor(protected setup: any) {
    super(setup, "page");
  }
}

export default PageModule;
