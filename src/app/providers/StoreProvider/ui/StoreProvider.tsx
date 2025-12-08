'use client';

import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';
import { StateSchema } from '../config/StateSchema';
import { AppStore, makeStore } from '../config/store';

interface StoreProviderProps {
	children: ReactNode;
	initialState?: DeepPartial<StateSchema>;
}

export function StoreProvider(props: StoreProviderProps) {
	const { children, initialState } = props;

	const storeRef = useRef<AppStore>(undefined);
	if (!storeRef.current) {
		storeRef.current = makeStore(initialState as StateSchema);
	}

	return <Provider store={storeRef.current}>{children}</Provider>;
}
