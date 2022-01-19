## Introduction

A simple script to sell ERC-721 and ERC-1155 tokens on opensea, either by selling a single asset in a English auction or a bundle of assets for a fixed price.

## Installation

- Install all required packages using
  `yarn install`

- Then create a `.env` file in the top level of the directory and add the required environment variables

```
NETWORK_PROVIDER=YOUR_NETWORK_PROVIDER
PRIVATE_KEY=YOUR_PRIVATE_KEY
APIKEY=YOUR_OPENSEA_API_KEY
NETWORK=test(for Rinkeby testnet)
```

## Usage

Refer `example.ts` to see how to use the methods.

## Development

- Changes can be done in `app.ts` to change the type of listing done on opensea, refer [opensea-js documentation](https://github.com/ProjectOpenSea/opensea-js)

- Provider can be changed instead of using `HDWalletProvider` make sure to make it compatible with given functions.
