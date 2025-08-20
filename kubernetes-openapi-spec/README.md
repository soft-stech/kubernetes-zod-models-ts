### Подготовка json для новой версии куба.

0. Внутри папки kubernetes-openapi-spec. Версию поменять на ту которая нужна

1. Устанавливаем go install sigs.k8s.io/controller-runtime/tools/setup-envtest@latest

2. Запускаем setup-envtest use 1.31.x --bin-dir ./bin или ~/go/bin/setup-envtest use 1.31.x --bin-dir ./bin если не нашелся в PATH

3. KUBEBUILDER_ASSETS=./bin/k8s/1.31.0-darwin-arm64 go run . -output ./openapi/1.31.0.json

То что ниже уже устарело. См https://github.com/kubernetes-sigs/kubebuilder/discussions/4082

# Kubernetes OpenAPI Spec

This repository contains OpenAPI spec JSON files for Kubernetes API.

## Differences

Files in `openapi` folder are almost identity to [`openapi-spec`](https://github.com/kubernetes/kubernetes/tree/master/api/openapi-spec) folder in `kubernetes` repository. The only difference is that OpenAPI files in this repository contains enum information.

Enum information once existed in `kubernetes` repository in `1.23`, but was removed in [PR #109178](https://github.com/kubernetes/kubernetes/pull/109178) for compatibility issues.

## Build

Before running the following command, make sure you have installed Go 1.19 or above on your computer.

```sh
make
```

To add a new version, just edit `all` target in `Makefile` and rerun `make` again.

To clean generated and temporary files, run:

```sh
make clean
```
