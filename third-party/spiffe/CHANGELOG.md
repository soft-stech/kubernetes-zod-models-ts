# @kubernetes-models/spiffe

## 1.1.4

### Patch Changes

- Updated dependencies []:
  - @soft-stech/apimachinery@1.3.2

## 1.1.3

### Patch Changes

- Updated dependencies [[`50d1914`](https://github.com/tommy351/kubernetes-models-ts/commit/50d19148027540e15edaa05360b76dc6e246b126)]:
  - @kubernetes-models/validate@3.1.1
  - @kubernetes-models/base@4.0.3
  - @kubernetes-models/apimachinery@1.2.1

## 1.1.2

### Patch Changes

- Updated dependencies [[`73daa2b`](https://github.com/tommy351/kubernetes-models-ts/commit/73daa2b36d44e88405e2337463fbb8999cddf359), [`09051d0`](https://github.com/tommy351/kubernetes-models-ts/commit/09051d0753e800ca3e7fd7c3f32c82cee1b6c154)]:
  - @kubernetes-models/apimachinery@1.2.0
  - @kubernetes-models/validate@3.1.0
  - @kubernetes-models/base@4.0.2

## 1.1.1

### Patch Changes

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

- Updated dependencies [[`9816d36`](https://github.com/tommy351/kubernetes-models-ts/commit/9816d3633d9722170fe761de4383d25f0c0a5ab3), [`767314d`](https://github.com/tommy351/kubernetes-models-ts/commit/767314d40b2d274f66cbbcfe68c5e3ed99138c94)]:
  - @kubernetes-models/apimachinery@1.1.1
  - @kubernetes-models/base@4.0.1
  - @kubernetes-models/validate@3.0.1

## 1.1.0

### Minor Changes

- [`d46053b`](https://github.com/tommy351/kubernetes-models-ts/commit/d46053b15d0315e91fdfdb1f7fe0b60b681a499a) Thanks [@tommy351](https://github.com/tommy351)! - Decrease the size of export map in `package.json` by using wildcard pattern (`*`).

  ```js
  // Before
  {
    "exports": {
      "./v1/Pod": {
        "import": "./v1/Pod.mjs",
        "require": "./v1/Pod.js"
      },
      "./v1/Service": {
        "import": "./v1/Service.mjs",
        "require": "./v1/Service.js"
      }
    }
  }

  // After
  {
    "exports": {
      "./v1/*": {
        "import": "./v1/*.mjs",
        "require": "./v1/*.js"
      }
    }
  }
  ```

- [`f82b1cc`](https://github.com/tommy351/kubernetes-models-ts/commit/f82b1cc64b27884a862166977617f00911a03e49) Thanks [@tommy351](https://github.com/tommy351)! - Support TypeScript `nodenext` module resolution by adding `types` to export map.

  ```js
  // Before
  {
    "exports": {
      "./v1/Pod": {
        "import": "./v1/Pod.mjs",
        "require": "./v1/Pod.js"
      }
    }
  }

  // After
  {
    "exports": {
      "./v1/Pod": {
        "import": {
          "types": "./v1/Pod.d.ts",
          "default": "./v1/Pod.mjs"
        }
        "require": {
          "types": "./v1/Pod.d.ts",
          "default": "./v1/Pod.js"
        }
      }
    }
  }
  ```

### Patch Changes

- Updated dependencies []:
  - @kubernetes-models/apimachinery@1.1.0

## 1.0.1

### Patch Changes

- Updated dependencies [[`ef175ce`](https://github.com/tommy351/kubernetes-models-ts/commit/ef175ce282461aea2a2d7977c31791bb12c9cff6)]:
  - @kubernetes-models/apimachinery@1.1.0

## 1.0.0

### Major Changes

- [#77](https://github.com/tommy351/kubernetes-models-ts/pull/77) [`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12.

### Patch Changes

- Updated dependencies [[`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58), [`d91ff07`](https://github.com/tommy351/kubernetes-models-ts/commit/d91ff07349ebfd8e9ca5bca1e9a08a8c64fa9216), [`a0d4e70`](https://github.com/tommy351/kubernetes-models-ts/commit/a0d4e70acb1ec8f9ea4a369e30531a1eeb7fed02), [`8a99963`](https://github.com/tommy351/kubernetes-models-ts/commit/8a99963e60a1479d97d63bb81a7830f2e36a9e05)]:
  - @kubernetes-models/base@4.0.0
  - @kubernetes-models/validate@3.0.0
  - @kubernetes-models/apimachinery@1.0.0

## 0.2.0

### Minor Changes

- [#75](https://github.com/tommy351/kubernetes-models-ts/pull/75) [`929ff88`](https://github.com/tommy351/kubernetes-models-ts/commit/929ff88dd0187cdf83e78317ad733b3f81de194a) Thanks [@tommy351](https://github.com/tommy351)! - Update CRDs to Spire v1.3.1.

## 0.1.1

### Patch Changes

- Updated dependencies [[`6e51206`](https://github.com/tommy351/kubernetes-models-ts/commit/6e512067557a938db902a88c18595fc7c76e9b37)]:
  - @kubernetes-models/apimachinery@0.2.0

## 0.1.0

### Minor Changes

- [#71](https://github.com/tommy351/kubernetes-models-ts/pull/71) [`56380ad`](https://github.com/tommy351/kubernetes-models-ts/commit/56380ad6eacc1fd09600f10c61abeb02d9178f8b) Thanks [@tommy351](https://github.com/tommy351)! - First release.

### Patch Changes

- Updated dependencies []:
  - @kubernetes-models/apimachinery@0.1.0
