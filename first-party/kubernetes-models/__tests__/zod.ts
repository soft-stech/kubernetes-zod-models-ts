import { describe, expect, it } from "vitest";
import { iPodSchema } from "../gen/v1/Pod.schema";
import { ZodError } from "zod";

describe("zod validate", () => {
  describe("when validation passed", () => {
    it("should pass", () => {
      const pod: unknown = {
        apiVersion: "v1",
        kind: "Pod",
        spec: {
          containers: []
        }
      };

      expect(() => iPodSchema.parse(pod)).not.toThrow();
    });
  });

  describe("when validation failed", () => {
    it("should throw an error", () => {
      const pod: unknown = {
        apiVersion: "v1",
        spec: {
          containers: []
        }
      };

      expect(() => iPodSchema.parse(pod)).toThrow(ZodError);
    });
  });
});
