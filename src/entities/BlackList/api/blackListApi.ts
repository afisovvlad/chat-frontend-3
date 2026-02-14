import { rtkApi } from '@/shared/api/rtkApi';

const blackListApi = rtkApi.injectEndpoints({
	endpoints: build => ({
		getBlackList: build.query({
			query: () => ({
				url: '/contact/blacklist/'
			})
		}),
		addBlackList: build.mutation({
			query: uid => ({
				url: `/contact/blacklist/add/${uid}/`,
				method: 'POST'
			})
		}),
		deleteBlackList: build.mutation({
			query: uid => ({
				url: `/contact/blacklist/delete/${uid}/`,
				method: 'DELETE'
			})
		})
	})
});

export const {
	useGetBlackListQuery,
	useAddBlackListMutation,
	useDeleteBlackListMutation
} = blackListApi;
