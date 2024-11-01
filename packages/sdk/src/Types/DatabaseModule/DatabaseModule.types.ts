import type { z } from "zod";
import type {
  ILog,
  IStatisticCreate,
  zAccountCreate,
  zAccountListQuery,
  zAccountTokenCreate,
  zActionCreate,
  zActionEdit,
  zActionListQuery,
  zAnalysisCreate,
  zAnalysisEdit,
  zAnalysisListQuery,
  zDeviceCreate,
  zDeviceDataCreate,
  zDeviceDataQuery,
  zDeviceDataUpdate,
  zDeviceEdit,
  zDeviceListQuery,
  zDeviceParameterCreate,
  zDeviceTokenCreate,
  zDeviceTokenListQuery,
  zPluginStorageItemSet,
} from "../index.ts";

/**
 * Data parameter of the `addDeviceData` function.
 */
export type IDatabaseDeviceDataCreate = z.output<typeof zDeviceDataCreate> & {
  chunk_timestamp_start?: Date;
  chunk_timestamp_end?: Date;
};

/**
 * Data parameter of the `editDeviceData` function.
 */
export type IDatabaseDeviceDataEdit = z.output<typeof zDeviceDataUpdate>;

/**
 * Data parameter of the `getDeviceData` functions.
 */
export type IDatabaseGetDeviceDataQuery = Omit<
  z.output<typeof zDeviceDataQuery>,
  "details"
>;

/**
 * Data parameter of the `addStatistic` function.
 */
export type IDatabaseAddStatisticData = IStatisticCreate;

/**
 * Data parameter of the `setPluginStorageItem` function.
 */
export type IDatabaseSetPluginStorageData = z.output<
  typeof zPluginStorageItemSet
>;

/**
 * Data parameter of the `addAnalysisLog` function.
 */
export type IDatabaseAddAnalysisLogData = ILog;

/**
 * Data parameter of the `createAnalysis` function.
 */
export type IDatabaseCreateAnalysisData = z.infer<typeof zAnalysisCreate>;

/**
 * Data parameter of the `editAnalysis` function.
 */
export type IDatabaseEditAnalysisData = z.infer<typeof zAnalysisEdit>;

/**
 * Data parameter of the `getAnalysisList` function.
 */
export type IDatabaseAnalysisListQuery = z.infer<typeof zAnalysisListQuery>;

/**
 * Data parameter of the `createAction` function.
 */
export type IDatabaseCreateActionData = z.infer<typeof zActionCreate>;

/**
 * Data parameter of the `editAction` function.
 */
export type IDatabaseEditActionData = z.infer<typeof zActionEdit>;

/**
 * Data parameter of the `getActionList` function.
 */
export type IDatabaseActionListQuery = z.infer<typeof zActionListQuery>;

/**
 * Data parameter of the `createDevice` function.
 */
export type IDatabaseCreateDeviceData = z.infer<typeof zDeviceCreate>;

/**
 * Data parameter of the `editDevice` function.
 */
export type IDatabaseEditDeviceData = z.infer<typeof zDeviceEdit>;

/**
 * Data parameter of the `getDeviceList` function.
 */
export type IDatabaseDeviceListQuery = z.infer<typeof zDeviceListQuery>;

/**
 * Data parameter of the `setDeviceParams` function.
 */
export type IDatabaseSetDeviceParamsData = z.infer<
  typeof zDeviceParameterCreate
>;

/**
 * Query parameter of the `getDeviceTokenList` function.
 */
export type IDatabaseGetDeviceTokenListQuery = z.infer<
  typeof zDeviceTokenListQuery
>;

/**
 * Data parameter of the `createDeviceToken` function.
 */
export type IDatabaseCreateDeviceTokenData = Omit<
  z.infer<typeof zDeviceTokenCreate>,
  "device_id"
>;

/**
 * Type parameter of the `getTagKeys` function.
 */
export type TDatabaseGetTagKeysType = "action" | "analysis" | "device";

/**
 * Data parameter of the `createAccountToken` function.
 */
export type IDatabaseAccountCreateTokenData = z.infer<
  typeof zAccountTokenCreate
>;

/**
 * Data parameter of the `createAccount` function.
 */
export type IDatabaseCreateAccountData = z.infer<typeof zAccountCreate>;

/**
 * Data parameter of the `getAccountList` function.
 */
export type IDatabaseAccountListQuery = z.infer<typeof zAccountListQuery>;
