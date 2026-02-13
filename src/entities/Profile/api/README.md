Запрос profileApi обновляет данные профиля пользователя (те данные, которые мы передаем в data).
После этого мы делаем запрос за обновленными данными (async onQueryStarted... try ...) и отправляем полученные обновленные данные в store профиля (dispatch(profileActions.setProfile(data)))

Для изменения данных в компоненте импортируем функцию editProfile -
const [
editProfile,
{ isLoading }
] = useEditProfileMutation();

и вызываем ее -

const onSubmit = async data => {
try{
const result = await editProfile(newData).unwrap();

    // .unwrap() сразу передает результат в data или выбрасывает error в catch

if (result) {
// логика при успехе
}
} catch (error) {
if (error?.data) {
// обрабатываем ошибку с сервера
}else {
обрабатываем ошибки, которые не включены в ответ сервера (например, status 500)
}
}
...
}

Либо второй вариант:

const [
sendNickname,
{ data: nicknameResponse, isLoading: nicknameLoading, error: nicknameError }
] = useSendNicknameMutation();

и вызываем ее -

useEffect(()=>{
sendNickname(nickname);
},[sendNickname,nickname ]);
const isNicknameFree = nicknameResponse?.messages === 'Этот nickname свободен';

data и error обрабатываем в useEffect

    useEffect(() => {
    	if (isNicknameFree) {
    		clearErrors(['name', 'nickname']);
    	}
    }, [isNicknameFree, clearErrors]);

useEffect(() => {
if (!nicknameError) {
return;
}

    	if ('data' in nicknameError && nicknameError.data) {
    		const errorData = nicknameError.data as Record<string, unknown>;

    		Object.entries(errorData).forEach(([key, messages]) => {
    			setError('nickname', {
    				type: 'server',
    				message: Array.isArray(messages)
    					? messages.join(', ')
    					: String(messages)
    			});
    		});
    	}
    }, [nicknameError, setError]);

data - ответ сервера при успехе,
isLoading - ожидание ответа сервера,
error - ответ сервера при ошибке 
