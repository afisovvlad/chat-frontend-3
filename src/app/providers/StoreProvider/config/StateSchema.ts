import { ProfileSchema } from '@/entities/Profile';
import { AuthSchema } from '@/features/auth';
import { CitiesSchema } from '@/pages/Cities';
import { localApi } from '@/shared/api/localApi';
import { rtkApi } from '@/shared/api/rtkApi';

export interface StateSchema {
	[rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>;
	routeApi: ReturnType<typeof localApi.reducer>;
	cities: CitiesSchema;
	auth: AuthSchema;
	profile: ProfileSchema;
}
