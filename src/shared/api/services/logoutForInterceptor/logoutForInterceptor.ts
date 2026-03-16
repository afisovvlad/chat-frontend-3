export async function logoutFromInterceptor() {
	try {
		await fetch('/api/auth/removeTokens', {
			method: 'POST'
		});

		// TODO: протестировать на обновление страницы
		window.location.replace('/login');
	} catch (_) {
		window.location.replace('/login');
	}
}
