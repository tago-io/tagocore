import TCoreModule from "../TCoreModule/TCoreModule.ts";

/**
 * This class allows a plugin to create a navbar button inside of tagocore.
 * ! only available internally to certain plugins developed by TagoIO.
 */
class NavbarButtonModule extends TCoreModule {
  constructor(protected setup: any) {
    super(setup, "navbar-button");
  }
}

export default NavbarButtonModule;
