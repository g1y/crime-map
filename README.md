# Crime Map

[![Build Status](https://travis-ci.org/g1y/crime-map.svg?branch=master)](https://travis-ci.org/g1y/crime-map) [![Maintainability](https://api.codeclimate.com/v1/badges/b299521ab1b7a9126eb4/maintainability)](https://codeclimate.com/github/g1y/crime-map/maintainability)

---

A distributed system to ingest, parse, track, and display various reports from police departments

## Requirements

- kubectl >= 1.21.0

## Deployment

### Setup Secrets

#### Apple Maps

In order to generate an API key, you'll need to be enrolled
in [Apple's Developer Program](https://developer.apple.com/programs/) ($99/year)

See [Creating a Maps Identifier and a Private Key](https://developer.apple.com/documentation/mapkitjs/creating_a_maps_identifier_and_a_private_key)

```bash
kubectl -n crime-map create secret generic apple-maps-key \
            --from-file=private-key=/path/to/authkey.p8 \
            --from-literal=issuer-id=<issuer-id> \
            --from-literal=key-id=<key-id>
```

#### Google Maps

See [Maps Geocoding API Guide - Using API Keys](https://developers.google.com/maps/documentation/geocoding/get-api-key)

Option 1: Use kubectl-whisper-secret (
requires [kubectl-whisper-secret](https://github.com/rewanthtammana/kubectl-whisper-secret))

```bash
kubectl -n crime-map whisper-secret secret generic google-maps \
            --from-literal=api-key=<api-key>
```

OR

Option 2: Use vanilla kubectl
(less secure, no dependencies)

```bash
kubectl -n crime-map create secret generic google-maps \
            --from-literal=api-key=<api-key>
```

### Use [kustomize](https://kustomize.io)

Dev $`kubectl appy -k kubernetes/overlays/dev`

Stage $`kubectl appy -k kubernetes/overlays/stage`

Prod $`kubectl appy -k kubernetes/overlays/prod`

