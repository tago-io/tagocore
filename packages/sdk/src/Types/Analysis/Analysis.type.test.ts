import { describe, expect, test } from "vitest";
import type { ZodError } from "zod";
import {
  zAnalysisCreate,
  zAnalysisEdit,
  zAnalysisList,
  zAnalysisListQuery,
  zAnalysisLogList,
} from "./Analysis.types.ts";

describe("zAnalysis Create", () => {
  test("Success", () => {
    const analysis_obj = {
      name: "My analysis script",
    };
    const result = zAnalysisCreate.parse(analysis_obj);

    expect(result.name).toBe("My analysis script");
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.tags).toHaveLength(0);
    expect(result.variables).toHaveLength(0);
    expect(result.id).toBeDefined();
  });

  test("Error - Name must contain at least 3 character(s)", () => {
    const analysis_obj = {
      name: "My",
    };
    try {
      zAnalysisCreate.parse(analysis_obj);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.name[0]).toBe(
        "String must contain at least 3 character(s)",
      );
    }
  });

  test("Error - Name must contain at most 100 character(s)", () => {
    const analysis_obj = {
      name: "My",
    };

    for (let index = 0; index < 100; index++) {
      analysis_obj.name = `${analysis_obj.name}a`;
    }

    try {
      zAnalysisCreate.parse(analysis_obj);
    } catch (error) {
      const errorF = (error as ZodError).flatten();
      expect(errorF.fieldErrors.name[0]).toBe(
        "String must contain at most 100 character(s)",
      );
    }
  });

  test("Error - Invalid active field", () => {
    const analysis_obj = {
      name: "My analysis",
      active: "yes",
    };

    try {
      zAnalysisCreate.parse(analysis_obj);
    } catch (error) {
      const errorF = (error as ZodError).flatten();
      expect(errorF.fieldErrors.active[0]).toBe(
        "Expected boolean, received string",
      );
    }
  });

  test("Error - Invalid tags field", () => {
    const analysis_obj = {
      name: "My analysis",
      tags: { key: "tag_key", value: "tag_value" },
    };

    try {
      zAnalysisCreate.parse(analysis_obj);
    } catch (error) {
      const errorF = (error as ZodError).flatten();
      expect(errorF.fieldErrors.tags[0]).toBe(
        "Expected array, received object",
      );
    }
  });

  test("Error - Invalid variables field", () => {
    const analysis_obj = {
      name: "My analysis",
      variables: { key: "tag_key", value: "tag_value" },
    };

    try {
      zAnalysisCreate.parse(analysis_obj);
    } catch (error) {
      const errorF = (error as ZodError).flatten();
      expect(errorF.fieldErrors.variables[0]).toBe("Invalid input");
    }
  });

  test("Error - Invalid file_path field", () => {
    const analysis_obj = {
      name: "My analysis",
      file_path: { key: "tag_key", value: "tag_value" },
    };

    try {
      zAnalysisCreate.parse(analysis_obj);
    } catch (error) {
      const errorF = (error as ZodError).flatten();
      expect(errorF.fieldErrors.file_path[0]).toBe(
        "Expected string, received object",
      );
    }
  });

  test("Error - Invalid binary_path field", () => {
    const analysis_obj = {
      name: "My analysis",
      binary_path: { key: "tag_key", value: "tag_value" },
    };

    try {
      zAnalysisCreate.parse(analysis_obj);
    } catch (error) {
      const errorF = (error as ZodError).flatten();
      expect(errorF.fieldErrors.binary_path[0]).toBe(
        "Expected string, received object",
      );
    }
  });

  test("Error - Invalid created_at & updated_at field", () => {
    const analysis_obj = {
      name: "My analysis",
      created_at: "2022-10-10",
      updated_at: "2022-11-11",
    };

    try {
      zAnalysisCreate.parse(analysis_obj);
    } catch (error) {
      const errorF = (error as ZodError).flatten();
      expect(errorF.fieldErrors.created_at[0]).toBe(
        "Expected date, received string",
      );
      expect(errorF.fieldErrors.updated_at[0]).toBe(
        "Expected date, received string",
      );
    }
  });
});

describe("Analysis Edit", () => {
  test("Success", () => {
    const analysis_obj = {
      name: "New analysis name",
      active: true,
      tags: [{ key: "analysis_tag_key", value: "analysis_tag_value" }],
    };
    const result = zAnalysisEdit.parse(analysis_obj);
    expect(result.name).toBe("New analysis name");
    expect(result.active).toBeTruthy();
    expect(result.tags).toHaveLength(1);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  test("Try to update a not allowed field", () => {
    const analysis_obj = {
      id: "32232323",
      console: "test",
    };
    const result = zAnalysisEdit.parse(analysis_obj);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  test("Error - invalid name", () => {
    const analysis_obj = {
      name: "A",
    };
    try {
      zAnalysisEdit.parse(analysis_obj);
    } catch (error) {
      const errorF = (error as ZodError).flatten();
      expect(errorF.fieldErrors.name[0]).toBe(
        "String must contain at least 3 character(s)",
      );
    }
  });
});

describe("Analysis List", () => {
  test("Success", () => {
    const result = zAnalysisList.parse([
      { id: "testid", tags: [{ key: "analysis_type", value: "math" }] },
    ]);

    expect(result[0].id).toBe("testid");
    expect(result[0].tags).toStrictEqual([
      { key: "analysis_type", value: "math" },
    ]);
  });

  test("Error - Required tags", () => {
    const filter = [
      {
        id: "testid",
      },
    ];
    try {
      zAnalysisList.parse(filter);
    } catch (error) {
      const errorF = (error as ZodError).flatten();

      expect(errorF.fieldErrors).toStrictEqual({ "0": ["Required"] });
    }
  });

  test("Error - Required ID", () => {
    const filter = [
      {
        tags: [],
      },
    ];
    try {
      zAnalysisList.parse(filter);
    } catch (error) {
      const errorF = (error as ZodError).flatten();

      expect(errorF.fieldErrors).toStrictEqual({ "0": ["Required"] });
    }
  });
});

describe("Analysis ListQuery", () => {
  test("Success", () => {
    const result = zAnalysisListQuery.parse({
      page: 2,
      amount: 999,
      fields: ["id", "name", "tags", "active"],
      filter: { id: "test" },
    });

    expect(result.page).toBe(2);
    expect(result.amount).toBe(999);
    expect(result.fields).toStrictEqual(["id", "name", "tags", "active"]);
    expect(result.filter).toStrictEqual({ id: "test" });
    expect(result.orderBy).toStrictEqual(["name", "asc"]);
  });

  test("Error - Invalid filter field page", () => {
    const filter = {
      page: "2",
    };
    try {
      zAnalysisList.parse(filter);
    } catch (error) {
      const errorF = (error as ZodError).flatten();

      expect(errorF.formErrors[0]).toBe("Expected array, received object");
    }
  });

  test("Error - Invalid filter field amount", () => {
    const filter = {
      amount: "2",
    };
    try {
      zAnalysisList.parse(filter);
    } catch (error) {
      const errorF = (error as ZodError).flatten();

      expect(errorF.formErrors[0]).toBe("Expected array, received object");
    }
  });

  test("Error - Invalid filter field fields", () => {
    const filter = {
      fields: [{ test: "test" }],
    };
    try {
      const r = zAnalysisList.parse(filter);
    } catch (error) {
      const errorF = (error as ZodError).flatten();

      expect(errorF.formErrors[0]).toBe("Expected array, received object");
    }
  });

  test("Error - Invalid filter field filter", () => {
    const filter = {
      filter: [{ test: "test" }],
    };
    try {
      const r = zAnalysisList.parse(filter);
    } catch (error) {
      const errorF = (error as ZodError).flatten();

      expect(errorF.formErrors[0]).toBe("Expected array, received object");
    }
  });
});

describe("Analysis LogList", () => {
  test("Success", () => {
    const result = zAnalysisLogList.parse([
      {
        error: true,
        message: "Hello World",
        timestamp: new Date(),
        analysis_id: "analysisid",
      },
    ]);

    expect(result[0].analysis_id).toBe("analysisid");
    expect(result[0].message).toBe("Hello World");
    expect(result[0].timestamp).toBeInstanceOf(Date);
    expect(result[0].error).toBeTruthy();
  });

  test("Error - Log must be an array", () => {
    try {
      const r = zAnalysisList.parse({});
    } catch (error) {
      const errorF = (error as ZodError).flatten();

      expect(errorF.formErrors[0]).toBe("Expected array, received object");
    }
  });

  test("Error - invalid log object", () => {
    const logs = [
      {
        error: "false",
      },
    ];
    try {
      const r = zAnalysisList.parse(logs);
    } catch (error) {
      const errorF = (error as ZodError).flatten();

      expect(errorF.fieldErrors[0]).toStrictEqual(["Required", "Required"]);
    }
  });
});
