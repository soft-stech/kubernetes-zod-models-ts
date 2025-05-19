# @kubernetes-models/apimachinery

## 1.3.2

### Patch Changes

- updated CRDs

## 1.2.1

### Patch Changes

- Updated dependencies [[`50d1914`](https://github.com/tommy351/kubernetes-models-ts/commit/50d19148027540e15edaa05360b76dc6e246b126)]:
  - @kubernetes-models/validate@3.1.1
  - @kubernetes-models/base@4.0.3

## 1.2.0

### Minor Changes

- [`73daa2b`](https://github.com/tommy351/kubernetes-models-ts/commit/73daa2b36d44e88405e2337463fbb8999cddf359) Thanks [@tommy351](https://github.com/tommy351)! - Update schema version to v1.27.1.

### Patch Changes

- Updated dependencies [[`09051d0`](https://github.com/tommy351/kubernetes-models-ts/commit/09051d0753e800ca3e7fd7c3f32c82cee1b6c154)]:
  - @kubernetes-models/validate@3.1.0
  - @kubernetes-models/base@4.0.2

## 1.1.1

### Patch Changes

- [`9816d36`](https://github.com/tommy351/kubernetes-models-ts/commit/9816d3633d9722170fe761de4383d25f0c0a5ab3) Thanks [@tommy351](https://github.com/tommy351)! - Replace non-index files with wildcard pattern (`*`) in export map.

  ```js
  // Before
  {
    "exports": {
      "./_schemas/IoK8sApimachineryPkgApiResourceQuantity": {},
      "./_schemas/IoK8sApimachineryPkgApisMetaV1APIGroup": {}
    }
  }

  // After
  {
    "exports": {
      "./_schemas/*": {}
    }
  }
  ```

- [`767314d`](https://github.com/tommy351/kubernetes-models-ts/commit/767314d40b2d274f66cbbcfe68c5e3ed99138c94) Thanks [@tommy351](https://github.com/tommy351)! - Simplify export map.

  ```js
  // Before
  {
    "exports": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  }

  // After
  {
    "exports": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  }
  ```

- Updated dependencies [[`767314d`](https://github.com/tommy351/kubernetes-models-ts/commit/767314d40b2d274f66cbbcfe68c5e3ed99138c94)]:
  - @kubernetes-models/base@4.0.1
  - @kubernetes-models/validate@3.0.1

## 1.1.0

### Minor Changes

- [#81](https://github.com/tommy351/kubernetes-models-ts/pull/81) [`ef175ce`](https://github.com/tommy351/kubernetes-models-ts/commit/ef175ce282461aea2a2d7977c31791bb12c9cff6) Thanks [@tommy351](https://github.com/tommy351)! - Enum types was removed in the last version because they are removed from OpenAPI spec in `kubernetes` models after v1.24.0 ([PR #109178](https://github.com/kubernetes/kubernetes/pull/109178)). In order to bring back enum types, I manually generated OpenAPI spec files and stored them in [tommy351/kubernetes-openapi-spec](https://github.com/tommy351/kubernetes-openapi-spec) repository.

## 1.0.0

### Major Changes

- [#77](https://github.com/tommy351/kubernetes-models-ts/pull/77) [`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12.

### Minor Changes

- [#77](https://github.com/tommy351/kubernetes-models-ts/pull/77) [`d91ff07`](https://github.com/tommy351/kubernetes-models-ts/commit/d91ff07349ebfd8e9ca5bca1e9a08a8c64fa9216) Thanks [@tommy351](https://github.com/tommy351)! - Update schema to Kubernetes v1.25.2.

### Patch Changes

- Updated dependencies [[`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58), [`a0d4e70`](https://github.com/tommy351/kubernetes-models-ts/commit/a0d4e70acb1ec8f9ea4a369e30531a1eeb7fed02), [`8a99963`](https://github.com/tommy351/kubernetes-models-ts/commit/8a99963e60a1479d97d63bb81a7830f2e36a9e05)]:
  - @kubernetes-models/base@4.0.0
  - @kubernetes-models/validate@3.0.0

## 0.2.0

### Minor Changes

- [#72](https://github.com/tommy351/kubernetes-models-ts/pull/72) [`6e51206`](https://github.com/tommy351/kubernetes-models-ts/commit/6e512067557a938db902a88c18595fc7c76e9b37) Thanks [@tommy351](https://github.com/tommy351)! - Update schema to Kubernetes v1.23.5.

## 0.1.0

### Minor Changes

- [#66](https://github.com/tommy351/kubernetes-models-ts/pull/66) [`04197d2`](https://github.com/tommy351/kubernetes-models-ts/commit/04197d23d5bc951b24a7e225f8d3070511861811) Thanks [@tommy351](https://github.com/tommy351)! - First release.

### Patch Changes

- Updated dependencies [[`2b18c6b`](https://github.com/tommy351/kubernetes-models-ts/commit/2b18c6bcbfe1a414beabda00a6f1332449b2e748), [`8b610d0`](https://github.com/tommy351/kubernetes-models-ts/commit/8b610d0130aebf48f9fb08bc9f6790f77281b4a9), [`e904810`](https://github.com/tommy351/kubernetes-models-ts/commit/e9048102c03569c19fc648ebff42b48e950dbc5c)]:
  - @kubernetes-models/base@3.0.0
