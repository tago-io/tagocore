type Config = {
  batch_size: number;
  region: string;
  queue_url: string;
  consumers_amount: number;
  pooling_time_rate: number;
} & (
  | { aws_access_key_id: string; aws_secret_access_key: string; type: "config" }
  | {
      type: "env";
    }
);

export type { Config };
