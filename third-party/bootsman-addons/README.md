# @soft-stech/bootsman-addons

[bootsman-addons](https://bootsman.tech/) models.

## Installation

Install with npm.

```sh
npm install @soft-stech/bootsman-addons
```

## Build

Create .env file.

```
GITLAB_URL=https://git.stsoft.team
GITLAB_TOKEN=<your gitlab key>
GITLAB_PROJECT_ID="1404"
```

Run pnpm run build

## Usage

```js
import { IBillingPluginServerSchema } from "@soft-stech/bootsman-addons/configuration.bootsman.tech/v1alpha1/BillingPluginServer.schema";
import { billingPluginServerBase } from "@soft-stech/bootsman-addons/configuration.bootsman.tech/v1alpha1/BillingPluginServer.base";
import { allDefaults } from "@soft-stech/bootsman-addons/configuration.bootsman.tech/v1alpha1/all.base";

const result = IBillingPluginServerSchema.safeParse(billingPluginServerBase);

console.log({ result });
```
