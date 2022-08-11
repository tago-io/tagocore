import { ZodError } from "zod";
import { zAccountList, zAccountCreate, zAccountTokenCreate, zAccountListQuery } from "./Account.types";

describe("zAccountList", () => {
  test("parses simple object", () => {
    const data = [
      {
        password: "password",
        id: "id",
      },
    ];
    const parsed = zAccountList.parse(data);
    expect(parsed[0].id).toEqual("id");
  });

  test("check required field", () => {
    const data = [
      {
        password: "password",
      },
    ];
    try {
      zAccountList.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.id).toBe(undefined);
    }
  });

  test("assure it is an array", () => {
    const data = {
      password: "password",
      id: "id",
    };
    try {
      zAccountList.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors).toStrictEqual({});
    }
  });
});

describe("zAccountListQuery", () => {
  test("parses simple object", () => {
    const data = {
      fields: ["id"],
    };
    const parsed = zAccountListQuery.parse(data);
    expect(parsed.fields[0]).toEqual("id");
  });

  test("error if invalid option", () => {
    const data = {
      fields: [" "],
    };
    try {
      zAccountListQuery.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.fields[0]).toBe(
        "Invalid enum value. Expected 'id' | 'name' | 'username' | 'password' | 'password_hint' | 'created_at'"
      );
    }
  });

  test("assure empty query", () => {
    const data = {
      fields: [],
    };
    const parsed = zAccountListQuery.parse(data);
    expect(parsed.fields).toBeNull;
  });
});

describe("zAccountCreate", () => {
  test("parses simple object", () => {
    const data = {
      name: "name",
      username: "username",
      password: "password",
    };
    const parsed = zAccountCreate.parse(data);
    expect(parsed.name).toEqual("name");
  });

  test("assure assignment of implicit fields", () => {
    const data = {
      name: "name",
      username: "username",
      password: "password",
    };
    const parsed = zAccountCreate.parse(data);
    expect(parsed.created_at).toBeInstanceOf(Date);
    expect(parsed.id).toEqual(expect.any(String));
    expect(parsed.password_hint).toBeNull;
  });
});

describe("zAccountTokenCreate", () => {
  test("parses simple object", () => {
    const data = {
      permission: "full",
    };
    const parsed = zAccountTokenCreate.parse(data);
    expect(parsed.permission).toEqual("full");
  });

  test("error if invalid option", () => {
    const data = {
      permission: " ",
    };
    try {
      zAccountTokenCreate.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.permission[0]).toBe("Invalid enum value. Expected 'full' | 'read' | 'write'");
    }
  });

  test("assure assignment of implicit fields", () => {
    const data = {
      permission: "full",
    };
    const parsed = zAccountTokenCreate.parse(data);
    expect(parsed.created_at).toBeInstanceOf(Date);
    expect(parsed.token).toEqual(expect.any(String));
    expect(parsed.expire_time).toEqual("1 month");
  });
});
