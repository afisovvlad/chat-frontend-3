export const getAccessToken = async () => {
	try {
		const response = await fetch('/api/auth/accessToken');
		if (response.ok) {
			const data = await response.json();
			return data.accessToken;
		}
	} catch {
		return null;
	}
	return null;
};
