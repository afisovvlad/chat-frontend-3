import { authActions } from '@/features/auth/model/slices/authSlice';
import { rtkApi } from '@/shared/api/rtkApi';

interface SendPhoneRequest {
	phone_number: string;
}

interface SendPhoneResponse {
	phone_number: string;
	code_len: number;
}

export const sendPhoneApi = rtkApi.injectEndpoints({
	endpoints: builder => ({
		sendPhone: builder.mutation<SendPhoneResponse, SendPhoneRequest>({
			query: data => ({
				url: `/${process.env.NEXT_PUBLIC_CODE}`,
				method: 'POST',
				body: data
			}),
			invalidatesTags: ['sendPhone'],
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const data = await queryFulfilled;
					dispatch(
						authActions.setPhoneData({
							phone_number: data.data.phone_number,
							code_len: data.data.code_len
						})
					);

					dispatch(authActions.setStep('code'));
				} catch (e) {
					console.error('sendPhone error', e);
				}
			}
		})
	})
});

export const { useSendPhoneMutation } = sendPhoneApi;
