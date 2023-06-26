import { clientsClaim, skipWaiting, setCacheNameDetails } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

setCacheNameDetails({
	prefix: 'nxtlottery_V1_'
});

clientsClaim();
/* eslint-disable-next-line no-restricted-globals */
self.__WB_DISABLE_DEV_LOGS = true;

// const toPrecache = self.__WB_MANIFEST.filter(
// 	(file) => false
// );
/* eslint-disable-next-line no-restricted-globals */
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
	/\.(?:js|css|html)$/,
	new StaleWhileRevalidate()
);

registerRoute(
	new RegExp('/'),
	new StaleWhileRevalidate()
);

registerRoute(
	/* eslint-disable-next-line no-restricted-globals */
	({ url }) => url.origin === self.location.origin &&
		(url.pathname.endsWith('.png') ||
			url.pathname.endsWith('.webp') ||
			url.pathname.endsWith('.ico') ||
			url.pathname.endsWith('.svg')
		),
	new StaleWhileRevalidate()
);

skipWaiting();

