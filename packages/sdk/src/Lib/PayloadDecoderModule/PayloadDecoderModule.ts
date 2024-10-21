import type { IModuleSetupWithoutType } from "../../Types.ts";
import TCoreModule from "../TCoreModule/TCoreModule.ts";

/**
 * This module allows data to be decoded after it is retrieved from a bucket.
 */
class PayloadDecoderModule extends TCoreModule {
  constructor(protected setup: IModuleSetupWithoutType) {
    super(setup, "decoder");
  }

  /**
   * Called when this payload decoder needs to decode a data structure.
   */
  public async onCall(data: any): Promise<any> {
    return data;
  }
}

export default PayloadDecoderModule;
