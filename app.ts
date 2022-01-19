import { OpenSeaPort } from 'opensea-js';

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

const listFunctions = (seaport: OpenSeaPort) => {
	const isAssetOwner = async (asset: Asset, accountAddress: string) => {
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
		accountAddress: string,
		startAmount: number,
		expirationTime: number,
		listingTime: number
	) => {
		try {
			console.log('🔎 Checking if account is owner...');
			const ownership = await isAssetOwner(asset, accountAddress);
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
		assets: Asset[],
		accountAddress: string,
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
				if (await isAssetOwner(assets[i], accountAddress)) {
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
	return { sellBundle, sellSingleAsset };
};

export default listFunctions;
