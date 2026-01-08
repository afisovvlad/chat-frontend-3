import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const media = window.matchMedia(query);
		const update = () => setMatches(media.matches);

		update();
		media.addEventListener('change', update);
		return () => media.removeEventListener('change', update);
	}, [query]);

	return matches;
};
