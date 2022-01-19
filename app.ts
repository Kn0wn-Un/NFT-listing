import HDWalletProvider from '@truffle/hdwallet-provider';
import { OpenSeaPort, Network } from 'opensea-js';

const RINKEBY_NETWORK: string =
	'https://rinkeby.infura.io/v3/9f5e9f6a900d405db1f7d31208676b40';
const PRIVATE_KEY: string =
	'0b190447fd1edb0449c6234ac1ec49cec322bddd5453cc6be3e2bc0b2a550566';

// This example provider won't let you make transactions, only read-only calls:
const provider = new HDWalletProvider(PRIVATE_KEY, RINKEBY_NETWORK);

const accountAddress: string = provider.getAddress();

const seaport = new OpenSeaPort(provider, {
	networkName: Network.Rinkeby,
});

interface Asset {
	// The asset's token ID, or null if ERC-20
	tokenId: string | null;
	// The asset's contract address
	tokenAddress: string;
	// Optional for ENS names
	name?: string;
	// Optional for fungible items
	decimals?: number;
}

const bundleAssets: Array<Asset> = [
	{
		tokenAddress: '0x1EF29Bd36e480ebe1a45712D5E37f395459B4D3d',
		tokenId: '4',
	},
	{
		tokenAddress: '0x1EF29Bd36e480ebe1a45712D5E37f395459B4D3d',
		tokenId: '5',
	},
];

const asset: Asset = {
	tokenAddress: '0x1EF29Bd36e480ebe1a45712D5E37f395459B4D3d',
	tokenId: '4',
};

const expirationTime: number = Math.round(Date.now() / 1000 + 60 * 60 * 24);
const listingTime: number = Math.round(Date.now() / 1000 + 60);

const isAssetOwner = async (asset: Asset) => {
	try {
		const resp = await seaport.api.getAsset(asset);
		console.log('🔗 Asset link: ' + resp.openseaLink);
		const balance = await seaport.getAssetBalance({
			accountAddress,
			asset,
		});
		return balance.equals(0);
	} catch (e) {
		console.log(e);
	}
};

const sellSingleAsset = async (
	asset: Asset,
	startAmount: number,
	expirationTime: number,
	listingTime: number
) => {
	try {
		console.log('🔎 Checking if account is owner...');
		const ownership = await isAssetOwner(asset);
		if (ownership) {
			console.log('❌ Does not own asset \n😶 Cannot list asset! Exiting');
			return;
		}

		console.log('✅ Owns Asset! \n📤 Making sale order... ');

		const listing = await seaport.createSellOrder({
			asset,
			accountAddress,
			startAmount,
			expirationTime,
			listingTime,
		});

		console.log('✅ Order placed');
		console.log('🤑 Asset sale link: ' + listing.assetBundle?.permalink);
	} catch (e) {
		console.log(e);
	}
};

const sellBundle = async (
	bundleName: string,
	bundleDescription: string,
	assets: [Asset],
	startAmount: number,
	listingTime: number
) => {
	if (!assets.length) {
		console.log('🙄 No assets given!');
		return;
	}

	try {
		console.log('🔎 Checking if account is owner of all assets...');
		for (let i: number = 0; i < assets.length; i++) {
			if (await isAssetOwner(assets[i])) {
				console.log('❌ Does not own asset \n😶 Cannot list asset! Exiting');
				return;
			}
		}

		console.log('✅ Owns Asset! \n📤 Making bundle order... ');
		const bundle = await seaport.createBundleSellOrder({
			bundleName,
			bundleDescription,
			assets,
			accountAddress,
			startAmount,
			listingTime,
		});

		console.log('✅ Order placed');
		console.log('🤑 Bundle sale link: ' + bundle.assetBundle?.permalink);
	} catch (e) {
		console.log(e);
	}
};

sellSingleAsset(
	{
		tokenAddress: '0x1EF29Bd36e480ebe1a45712D5E37f395459B4D3d',
		tokenId: '1',
	},
	0.5,
	expirationTime,
	listingTime
);

provider.engine.stop();
