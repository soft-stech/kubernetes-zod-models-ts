# @kubernetes-models/postgres-operator

## 0.3.1

### Patch Changes

- Updated dependencies []:
  - @soft-stech/apimachinery@1.3.2

## 0.3.0

### Minor Changes

- [#182](https://github.com/tommy351/kubernetes-models-ts/pull/182) [`b61c242`](https://github.com/tommy351/kubernetes-models-ts/commit/b61c242e10bb1c5fe02336af7772dbfd3b2084a1) Thanks [@tommy351](https://github.com/tommy351)! - Update Zalando Postgres operator to v1.11.0.

- [#182](https://github.com/tommy351/kubernetes-models-ts/pull/182) [`b61c242`](https://github.com/tommy351/kubernetes-models-ts/commit/b61c242e10bb1c5fe02336af7772dbfd3b2084a1) Thanks [@tommy351](https://github.com/tommy351)! - Update CrunchyData Postgres operator to v5.5.1.

## 0.2.3

### Patch Changes

- Updated dependencies [[`50d1914`](https://github.com/tommy351/kubernetes-models-ts/commit/50d19148027540e15edaa05360b76dc6e246b126)]:
  - @kubernetes-models/validate@3.1.1
  - @kubernetes-models/base@4.0.3
  - @kubernetes-models/apimachinery@1.2.1

## 0.2.2

### Patch Changes

- Updated dependencies [[`73daa2b`](https://github.com/tommy351/kubernetes-models-ts/commit/73daa2b36d44e88405e2337463fbb8999cddf359), [`09051d0`](https://github.com/tommy351/kubernetes-models-ts/commit/09051d0753e800ca3e7fd7c3f32c82cee1b6c154)]:
  - @kubernetes-models/apimachinery@1.2.0
  - @kubernetes-models/validate@3.1.0
  - @kubernetes-models/base@4.0.2

## 0.2.1

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

## 0.2.0

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

## 0.1.0

### Minor Changes

- [#96](https://github.com/tommy351/kubernetes-models-ts/pull/96) [`112083d`](https://github.com/tommy351/kubernetes-models-ts/commit/112083d6a5daa6d22eac8adb30afeb8e1cc89ee5) Thanks [@tommy351](https://github.com/tommy351)! - First release.

### Patch Changes

- Updated dependencies []:
  - @kubernetes-models/apimachinery@1.1.0
