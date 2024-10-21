// ? ==================================== (c) TagoIO ====================================
// ? What is this file?
// * This generate a Runtypes, it's a example export the interface and instance
// * The interface can be used with resolve Body to give better auto-complete of typescript.
// ? ====================================================================================
interface IMeta {
  device?: string;
  application?: string;
}

interface ISolutions {
  lat: number;
  lng: number;
  precision: number;
  quality: string;
  method: string;
}

interface IParams {
  solutions: ISolutions[];
  device: string;
  payload: string;
  port: number;
  duplicate?: boolean;
  counter_up?: number;
  rx_time?: number;
  radio: number;
  encrypted_payload?: string;
}

interface IEverynetObject {
  meta: IMeta;
  type?: string;
  verification_code?: string;
  params: IParams;
}

export type { IEverynetObject };
