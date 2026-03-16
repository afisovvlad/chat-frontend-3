1. Компонент Form имеет провайдер (FormProvider) который должен оборачивать ВСЕ элементы формы, - чтобы каждый элемент имел доступ к информации о введенном значении и ошибках. Если Элемент формы поместить вне FormProvider - будет ошибка.

2. Для базового использования элементов формы нужна минимальная структура:

interface SearchForm {
search: string;
}

const methods = useForm<SearchForm>();

const onSubmit: SubmitHandler<SearchForm> = data => {
console.log(data); // data -значения всех полей
// пишем логику, что делать при нажатии на кнопку "Отправить", например, делаем запрос на api
};

    <Form<SearchForm> onSubmit={onSubmit} methods={methods}>

// Добавляем необходимые элементы формы
<Label name='search' parentLabelClass={styles.label}>
Введите дату своего рождения
</Label>

    		<Input name={'name'} type="text" />

    		<Button type='submit'>Отправить</Button>

    </Form>

3. Все элементы формы находятся в shared/ui/Form/FormItems/ui/
   Провайдер формы - в shared/ui/Form/FormProvider/ui/

4. Все элементы формы могут принимать классы от родителей (названия классов нужно смотреть у каждого конкретного элемента), например, - Label принимает класс от родителя под названием "parentLabelClass"

5. Для всех полей необходим prop "name". Для элемента Input важен так же prop "type" (по умолчанию - "text").
