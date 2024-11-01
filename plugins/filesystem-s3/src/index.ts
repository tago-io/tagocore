import { FileSystemModule } from "@tago-io/tcore-sdk";
import AWS from "aws-sdk";
import { resolveFile } from "./resolveFile.ts";
import { resolveFolder } from "./resolveFolder.ts";

/**
 * Config values.
 */
interface ISetupValues {
  access_key: string;
  bucket: string;
  secret_access_key: string;
  ttl: string;
  type: "env" | "config";
}

/**
 * Current config values.
 */
let values: ISetupValues = {
  access_key: "",
  bucket: "",
  secret_access_key: "",
  ttl: "",
  type: "config",
};

/**
 * Does a object list with a limit of 1 on S3 to verify if the credentials
 * can hit the bucket properly.
 */
async function validateCredentials(data: ISetupValues) {
  try {
    const s3 = new AWS.S3({
      apiVersion: "2015-03-31",
      credentials: {
        accessKeyId: data.access_key,
        secretAccessKey: data.secret_access_key,
      },
    });

    await s3.listObjectsV2({ MaxKeys: 1, Bucket: data.bucket }).promise();
  } catch (ex) {
    throw new Error("Authorization denied: Invalid credentials");
  }
}

/**
 * Used to validate and store config values.
 */
async function onLoad(data: ISetupValues) {
  if (data.type === "env") {
    data.access_key = process.env.AWS_ACCESS_KEY_ID || "";
    data.secret_access_key = process.env.AWS_SECRET_ACCESS_KEY || "";
  }

  if (!data.access_key) {
    throw new Error("Invalid Access Key ID");
  }
  if (!data.secret_access_key) {
    throw new Error("Invalid Secret Access Key");
  }
  if (!data.bucket) {
    throw new Error("Invalid Bucket name");
  }

  await validateCredentials(data);

  values = data;
}

/**
 * Filesystem module.
 */
const filesystem = new FileSystemModule({
  id: "s3-filesystem",
  name: "AWS S3 Filesystem",
  configs: [
    {
      type: "group",
      name: "Get Credentials from",
      icon: "key",
      field: "group",
      configs: [
        {
          type: "radio",
          field: "type",
          defaultValue: "config",
          options: [
            {
              label: "From Environment",
              description: "Get the AWS Credentials from environment variables",
              color: "#e15243",
              value: "env",
              icon: "desktop",
              configs: [],
            },
            {
              label: "From Settings",
              description:
                "Manually set AWS Credentials via this settings page",
              color: "#e15243",
              value: "config",
              icon: "cog",
              configs: [],
            },
          ],
        },
        {
          name: "AWS Access Key ID",
          field: "access_key",
          type: "password",
          icon: "key",
          required: true,
          visibility_conditions: [
            { condition: "=", field: "type", value: "config" },
          ],
        },
        {
          name: "AWS Secret Access Key",
          field: "secret_access_key",
          type: "password",
          icon: "key",
          required: true,
          visibility_conditions: [
            { condition: "=", field: "type", value: "config" },
          ],
        },
      ],
    },
    {
      name: "AWS S3 Bucket name",
      field: "bucket",
      icon: "bucket",
      type: "string",
      tooltip: "Files will be acquired from here",
      required: true,
    },
    {
      type: "group",
      name: "Cache policy",
      icon: "cog",
      field: "cache",
      configs: [
        {
          name: "Keep files in disk for",
          field: "ttl",
          icon: "clock",
          type: "option",
          tooltip:
            "The amount of time in minutes that the files will be stored in the local disk before being fetched again from S3",
          defaultValue: "1",
          options: [
            { label: "1 minute", value: "60" },
            { label: "5 minutes", value: "300" },
            { label: "10 minutes", value: "600" },
            { label: "30 minutes", value: "1800" },
            { label: "60 minutes", value: "3600" },
          ],
        },
      ],
    },
  ],
});

filesystem.onLoad = onLoad;
filesystem.resolveFile = resolveFile;
filesystem.resolveFolder = resolveFolder;

export { values };
