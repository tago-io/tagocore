import type { TGenericID } from "./Common/Common.types.ts";

export interface INetworkDeviceParameter {
  name?: string;
  label?: string;
  type?: "text" | "dropdown" | "switch" | "number";
  default?: any;
  group?: "default" | "main" | "advanced" | "hide";
  options?: any[]; // optional, only for dropdown
}

export interface INetworkCreate {
  name?: string;
  description?: string;
  logo_url?: string;
  icon_url?: string;
  banner_url?: string;
  device_parameters?: INetworkDeviceParameter[];
  middleware_endpoint?: string;
  payload_encoder?: string;
  payload_decoder?: string;
  public?: boolean;
  documentation_url?: string;
  serial_number?: {
    mask?: string;
    label?: string;
    image?: string;
    case?: string;
    help?: string;
    required?: boolean;
  };
  require_devices_access?: boolean;
}

export interface INetwork extends INetworkCreate {
  id: TGenericID;
  name?: string;
  description?: string;
  logo_url?: string;
  icon_url?: string;
  banner_url?: string;
  device_parameters?: INetworkDeviceParameter[];
  middleware_endpoint?: string;
  payload_encoder?: string;
  payload_decoder?: string;
  public?: boolean;
  documentation_url?: string;
  serial_number?: {
    mask?: string;
    label?: string;
    image?: string;
    case?: string;
    help?: string;
    required?: boolean;
  };
}

export type INetworkListQuery = any;

// export type INetworkListQuery = Query<
//   INetwork,
//   | "name"
//   | "description"
//   | "logo_url"
//   | "icon_url"
//   | "banner_url"
//   | "device_parameters"
//   | "middleware_endpoint"
//   | "payload_encoder"
//   | "payload_decoder"
//   | "serial_number"
//   | "documentation_url"
//   | "public"
//   | "created_at"
//   | "updated_at"
// >;
