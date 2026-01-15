import { rtkApi } from '@/shared/api/rtkApi';
import { authActions } from '@/features/auth/model/slices/authSlice';

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
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				//  optimistic update — СРАЗУ кладём в store
				dispatch(
					authActions.setPhoneData({
						phone_number: arg.phone_number,
						code_len: 5
					})
				);
				dispatch(authActions.setStep('code'));

				try {
					const { data } = await queryFulfilled;
					// обновляем данными сервера
					dispatch(
						authActions.setPhoneData({
							phone_number: data.phone_number,
							code_len: data.code_len
						})
					);
				} catch (err) {
					//  rollback при ошибке
					dispatch(authActions.clearPhoneData());
					dispatch(authActions.setStep('phone'));
				}
			}
		})
	})
});

export const { useSendPhoneMutation } = sendPhoneApi;
