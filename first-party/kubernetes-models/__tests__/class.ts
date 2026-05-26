import { describe, it, expect } from "vitest";
import { Deployment as DeploymentV1 } from "../gen/apps/v1/Deployment";
import { Ingress as IngressV1 } from "../gen/networking.k8s.io/v1/Ingress";
import { Pod } from "../gen/v1/Pod";
import { PodSpec } from "../gen/v1/PodSpec";

describe("Deployment apps/v1", () => {
  const deployment = new DeploymentV1({
    metadata: {
      name: "test"
    }
  });

  it("should set apiVersion", () => {
    expect(deployment).toHaveProperty("apiVersion", "apps/v1");
  });

  it("should set kind", () => {
    expect(deployment).toHaveProperty("kind", "Deployment");
  });

  it("should set metadata", () => {
    expect(deployment.metadata).toEqual({ name: "test" });
  });

  it("toJSON", () => {
    expect(deployment.toJSON()).toEqual({
      apiVersion: "apps/v1",
      kind: "Deployment",
      metadata: {
        name: "test"
      }
    });
  });
});

describe("Ingress networking.k8s.io/v1", () => {
  const ingress = new IngressV1({});

  it("should set apiVersion", () => {
    expect(ingress).toHaveProperty("apiVersion", "networking.k8s.io/v1");
  });

  it("should set kind", () => {
    expect(ingress).toHaveProperty("kind", "Ingress");
  });
});

describe("Pod", () => {
  const pod = new Pod();

  it("should set apiVersion", () => {
    expect(pod).toHaveProperty("apiVersion", "v1");
  });

  it("should set kind", () => {
    expect(pod).toHaveProperty("kind", "Pod");
  });
});

// Test if definitions without GVK are still exported
describe("PodSpec", () => {
  const spec = new PodSpec({
    containers: [
      {
        name: "busybox",
        image: "busybox"
      }
    ]
  });

  it("should set containers", () => {
    expect(spec).toHaveProperty("containers", [
      {
        name: "busybox",
        image: "busybox"
      }
    ]);
  });
});
