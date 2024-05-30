import { describe, it, expect, vi } from "vitest";
import { Model, setSchema } from "../model";
import { register } from "@soft-stech/validate";

describe("toJSON", () => {
  it("should not set undefined props", () => {
    const json = new Model({
      spec: undefined
    }).toJSON();

    expect(json).toEqual({});
  });

  it("should not set undefined props in an object", () => {
    const json = new Model({
      spec: {
        nodeName: undefined
      }
    }).toJSON();

    expect(json).toEqual({
      spec: {}
    });
  });

  it("should not set undefined props in an array", () => {
    const json = new Model({
      spec: {
        containers: [
          {
            name: "foo",
            image: undefined
          }
        ]
      }
    }).toJSON();

    expect(json).toEqual({
      spec: {
        containers: [{ name: "foo" }]
      }
    });
  });
});

describe("validate", () => {
  describe("when schema is not set", () => {
    it("should do nothing", () => {
      const model = new Model();
      expect(() => model.validate()).not.toThrow();
    });
  });

  describe("when schema is set", () => {
    it("works", () => {
      class MyModel extends Model<unknown> {}
      const addSchema = vi.fn();
      register("foo", {});
      setSchema(MyModel, "foo", addSchema);
      const model = new MyModel();
      model.validate();
      expect(addSchema).toHaveBeenCalledTimes(1);
    });
  });
});
