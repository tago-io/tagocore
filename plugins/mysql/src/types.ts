export declare type ConnectionType = "single" | "read_write";

export declare type SSLMode = "disabled" | "preferred" | "verify";

declare type DeviceConnection = {
  use_device_connection: true;
  device_connection: ConnectionType;
  device_read_host: string;
  device_read_port: number;
  device_write_host: string;
  device_write_port: number;
  device_database: string;
  device_user: string;
  device_password?: string;
  device_min_pool: number;
  device_max_pool: number;
} & (
  | { device_use_ssl: false }
  | {
      device_use_ssl: true;
      device_ssl_verify_server_cert: boolean;
      device_ssl_key?: string;
      device_ssl_cert?: string;
      device_ssl_ca_cert?: string;
      device_ssl_cipher?: string;
    }
) &
  (
    | { device_connection: "single" }
    | {
        device_connection: "read_write";
        device_write_host: string;
        device_write_port: number;
      }
  );

declare type MainConnection = {
  main_connection: ConnectionType;
  main_read_host: string;
  main_read_port: number;
  main_database: string;
  main_user: string;
  main_password?: string;
  main_min_pool: number;
  main_max_pool: number;
} & (
  | { main_use_ssl: false }
  | {
      main_use_ssl: true;
      main_ssl_verify_server_cert: boolean;
      main_ssl_key?: string;
      main_ssl_cert?: string;
      main_ssl_ca_cert?: string;
      main_ssl_cipher?: string;
    }
) &
  (
    | { main_connection: "single" }
    | {
        main_connection: "read_write";
        main_write_host: string;
        main_write_port: number;
      }
  );

export declare type Config = MainConnection &
  (
    | {
        use_device_connection: false;
        device_database: string;
      }
    | DeviceConnection
  );
