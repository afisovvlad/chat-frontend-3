import { CitiesSchema } from '@/pages/Cities';
import { rtkApi } from '@/shared/api/rtkApi';

export interface StateSchema {
	[rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>;
	cities: CitiesSchema;
}
