import { useState, useCallback } from 'react';

interface ScaleControl {
	scale: number;
	minScale: number;
	maxScale: number;
	setScale: (value: number) => void;
	setMinScale: (value: number) => void;
	setMaxScale: (value: number) => void;
}

export const useScaleControl = (
	initialScale: number,
	initialMinScale: number,
	initialMaxScale: number
): ScaleControl => {
	const [scale, setScale] = useState(initialScale);
	const [minScale, setMinScale] = useState(initialMinScale);
	const [maxScale, setMaxScale] = useState(initialMaxScale);

	const handleScaleChange = useCallback((value: number) => {
		setScale(value);
	}, []);

	const handleMinScaleChange = useCallback((value: number) => {
		setMinScale(value);
	}, []);

	const handleMaxScaleChange = useCallback((value: number) => {
		setMaxScale(value);
	}, []);

	return {
		scale,
		minScale,
		maxScale,
		setScale: handleScaleChange,
		setMinScale: handleMinScaleChange,
		setMaxScale: handleMaxScaleChange
	};
};
