import TCoreModule from "../TCoreModule/TCoreModule.ts";

/**
 * This module allows data to be encoded before it is inserted into a bucket.
 */
class PayloadEncoderModule extends TCoreModule {
  constructor(protected setup: any) {
    super(setup, "encoder");
  }

  /**
   * Called when this payload encoder needs to encode a data structure.
   */
  public async onCall(data: any): Promise<any> {
    return data;
  }
}

export default PayloadEncoderModule;
