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

/**
 *
 * @param seaport OpenSeaJS client, called an OpenSeaPort
 * @returns sellSingleAsset and sellBundle functions
 */
const listFunctions = (seaport: OpenSeaPort) => {
	/**
	 *
	 * @param asset asset object to check ownership
	 * @param accountAddress public key of account
	 * @returns
	 */
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

	/**
	 *
	 * @param asset asset object to sell
	 * @param accountAddress public key of account
	 * @param startAmount minimum price to start auction
	 * @param expirationTime time at which the auction expires
	 * @param listingTime time at which the item will be listed to sell
	 * @returns
	 */
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

	/**
	 *
	 * @param bundleName name of the bundle
	 * @param bundleDescription description of the bundle
	 * @param assets array of assets to sell
	 * @param accountAddress public key of the account
	 * @param startAmount price of the bundle
	 * @param listingTime time at which the asset will be listed
	 * @returns
	 */
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
