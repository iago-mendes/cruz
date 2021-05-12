declare let self: ServiceWorkerGlobalScope

self.__WB_DISABLE_DEV_LOGS = true

self.addEventListener('message', event => {
	console.log(event?.data)
})

self.addEventListener('push',  (event) => {
	const data = JSON.parse(event?.data.text() || '{}')
	event?.waitUntil(
		self.registration.showNotification(data.title, {
			body: data.message,
			icon: '/icons/android-chrome-192x192.png'
		})
	)
})

self.addEventListener('notificationclick',  (event) => {
	event?.notification.close()
	event?.waitUntil(
		self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
			if (clientList.length > 0) {
				let client = clientList[0]
				for (let i = 0; i < clientList.length; i++) {
					if (clientList[i].focused) {
						client = clientList[i]
					}
				}
				return client.focus()
			}
			return self.clients.openWindow('/')
		})
	)
})

export {}