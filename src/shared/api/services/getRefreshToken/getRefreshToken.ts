export const getRefreshToken = async () => {
	try {
		const response = await fetch('/api/auth/refreshToken');
		if (response.ok) {
			const data = await response.json();
			return data.accessToken;
		}
	} catch {
		return null;
	}
	return null;
};
