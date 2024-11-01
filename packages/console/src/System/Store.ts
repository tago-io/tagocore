import type { IAccount, IPluginList } from "@tago-io/tcore-sdk/types";
import { makeObservable, observable } from "mobx";

interface IStore {
  socketConnected?: boolean;
  plugins: IPluginList;
  version: string;
  account?: IAccount;
  token: string;
  masterPasswordConfigured?: boolean;
  accountConfigured?: boolean;
  databaseConfigured?: boolean;
  databaseError?: boolean;
  masterPassword: string;
}

const store: IStore = {
  socketConnected: false,
  plugins: [],
  version: "",
  account: undefined,
  token: "",
  masterPasswordConfigured: false,
  accountConfigured: false,
  databaseConfigured: false,
  databaseError: false,
  masterPassword: "",
};

makeObservable(store, {
  plugins: observable,
  socketConnected: observable,
  version: observable,
  account: observable,
  token: observable,
  masterPasswordConfigured: observable,
  accountConfigured: observable,
  databaseConfigured: observable,
  databaseError: observable,
  masterPassword: observable,
});

export default store;
