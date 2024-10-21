import type { INetworkDeviceParameter, TGenericID } from "./index.ts";

export interface IConnectorCreate {
  name?: string;
  description?: string;
  logo_url?: string;
  device_parameters?: INetworkDeviceParameter[];
  networks?: string[];
  payload_decoder?: string;
  install_text?: string;
  install_end_text?: string;
  device_annotation?: string;
}

export interface IConnector extends IConnectorCreate {
  id: TGenericID;
  public: boolean;
  description?: string;
  logo_url?: string;
  created_at: Date;
  updated_at: Date;
  device_parameters?: INetworkDeviceParameter[];
  networks?: string[];
  install_text?: string;
  install_end_text?: string;
  device_annotation?: string;
}

export type IConnectorListQuery = any;

// export type IConnectorListQuery = Query<
//   IConnector,
//   | "name"
//   | "id"
//   | "description"
//   | "logo_url"
//   | "install_text"
//   | "install_end_text"
//   | "device_annotation"
//   | "payload_decoder"
//   | "networks"
// >;
