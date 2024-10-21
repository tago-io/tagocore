type Config = {
  host: string;
  port: number;
  queue: string;
  user: string;
  password?: string;
  prefetch?: number;
  msg_ttl?: number;
};

export type { Config };
