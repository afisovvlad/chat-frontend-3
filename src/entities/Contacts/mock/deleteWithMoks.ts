export const deleteWithMocks = async <T>(
	apiCall: () => Promise<T>,
	isMockMode: boolean
): Promise<T | void> => {
	if (isMockMode) {
		await new Promise(resolve => setTimeout(resolve, 250));
		return undefined as T;
	}
	return apiCall();
};
