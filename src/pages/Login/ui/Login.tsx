import {
	Button,
	ButtonColor,
	ButtonSize,
	ButtonTheme
} from '@/shared/ui/Button';
import {
	FontWeight,
	Text,
	TextAlign,
	TextClamp,
	TextColor,
	TextSize,
	TextTag,
	TextType,
	TitleTag
} from '@/shared/ui/Text';
import { ReactNode } from 'react';
import cls from './Login.module.scss';

import { Logo, VolumeOff } from '@icons/index';

interface LoginProps {
	className?: string;
	children?: ReactNode;
}

export const Login = ({ className, children }: LoginProps) => {
	return (
		<div className={cls.Login}>
			login
			{children}
			<Button
				theme={ButtonTheme.BACKGROUND}
				color={ButtonColor.PRIMARY}
				size={ButtonSize.L}
			>
				background + primary
			</Button>
			<Button
				theme={ButtonTheme.BACKGROUND}
				color={ButtonColor.PRIMARY}
				size={ButtonSize.L}
				disabled
			>
				background + primary + disabled
			</Button>
			<Button
				theme={ButtonTheme.BACKGROUND}
				color={ButtonColor.DANGER}
				size={ButtonSize.L}
				callBtn
			>
				background + danger
			</Button>
			<Button
				theme={ButtonTheme.BACKGROUND}
				color={ButtonColor.GREEN}
				size={ButtonSize.L}
				callBtn
			>
				background + green
			</Button>
			<Button
				theme={ButtonTheme.BACKGROUND}
				color={ButtonColor.PRIMARY}
				size={ButtonSize.S}
			>
				background + size_s
			</Button>
			<Button
				theme={ButtonTheme.OUTLINE}
				color={ButtonColor.PRIMARY}
				size={ButtonSize.S}
			>
				outline + primary
			</Button>
			<Button
				theme={ButtonTheme.CLEAR}
				color={ButtonColor.PRIMARY}
				size={ButtonSize.S}
			>
				clear + primary
			</Button>
			<Button
				theme={ButtonTheme.CLEAR}
				color={ButtonColor.DANGER}
				size={ButtonSize.S}
			>
				clear + danger
			</Button>
			<Button
				theme={ButtonTheme.CIRCLE}
				color={ButtonColor.PRIMARY}
				size={ButtonSize.S}
			>
				icn
			</Button>
			<Button
				theme={ButtonTheme.CIRCLE}
				color={ButtonColor.TRANSPARENT}
				size={ButtonSize.S}
			>
				icn
			</Button>
			<Button
				theme={ButtonTheme.CIRCLE}
				color={ButtonColor.PRIMARY}
				size={ButtonSize.S}
				widthDesktop='100px'
				heightDesktop='100px'
				widthMobile='50px'
				heightMobile='50px'
			>
				icn
			</Button>
			<div className={cls.container}>
				<Logo className={cls.logo} />
				<h1 className={cls.heading}>Компонент Text</h1>

				<section className={cls.section}>
					<h2>1. Базовые типы</h2>
					<Text type={TextType.TITLE}>Заголовок (TITLE, h3 по умолчанию)</Text>
					<Text>Обычный текст (TEXT, p по умолчанию)</Text>
				</section>

				<section className={cls.section}>
					<h2>2. Размеры и вес</h2>
					<Text fontSize={TextSize.S}>Размер S (14px)</Text>
					<Text fontSize={TextSize.M}>Размер M (16px)</Text>
					<Text fontSize={TextSize.L}>Размер L (18px)</Text>
					<Text fontSize={TextSize.XL}>Размер XL (24px)</Text>
					<Text fontSize={TextSize.XXL}>Размер XXL (32px)</Text>
					<Text fontSize={TextSize.XXXL}>Размер XXXL (34px)</Text>

					<Text fontWeight={FontWeight.REGULAR}>Regular (400)</Text>
					<Text fontWeight={FontWeight.MEDIUM}>Medium (500)</Text>
					<Text fontWeight={FontWeight.SEMI_BOLD}>Semi Bold (600)</Text>
					<Text fontWeight={FontWeight.BOLD}>Bold (700)</Text>
					<Text fontWeight={FontWeight.EXTRA_BOLD}>Extra Bold (800)</Text>
				</section>

				<section className={cls.section}>
					<h2>3. Цвета</h2>
					<Text color={TextColor.BLACK}>Чёрный (BLACK)</Text>
					<Text color={TextColor.GRAY}>Серый (GRAY)</Text>
					<Text color={TextColor.ERROR}>Ошибка (ERROR)</Text>
					<Text color={TextColor.ACCENT}>Предупреждение (WARNING)</Text>
					<Text color={TextColor.WHITE} className={cls.whiteBg}>
						Белый текст (WHITE) — на чёрном фоне
					</Text>
				</section>

				<section className={cls.section}>
					<h2>4. Обрезка текста</h2>
					<div className={cls.demoBox}>
						<Text truncate>
							Однострочная обрезка: очень длинный текст, который не должен
							переноситься...
						</Text>
					</div>

					<div className={cls.demoBox}>
						<Text maxLines={TextClamp.LINES_2}>
							Многострочная обрезка на 2 строки: Lorem ipsum dolor sit amet,
							consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
							labore et dolore magna aliqua.
						</Text>
					</div>

					<div className={cls.demoBox}>
						<Text maxLines={TextClamp.LINES_3}>
							Многострочная обрезка на 3 строки: Ut enim ad minim veniam, quis
							nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
							consequat. Duis aute irure dolor in reprehenderit.
						</Text>
					</div>
				</section>

				<section className={cls.section}>
					<h2>5. Верхний регистр</h2>
					<Text uppercase>этот текст в верхнем регистре</Text>
					<Text type={TextType.TITLE} uppercase>
						заголовок в верхнем регистре
					</Text>
				</section>

				<section className={cls.section}>
					<h2>6. Выравнивание</h2>
					<Text textAlign={TextAlign.LEFT}>Выравнивание по левому краю</Text>
					<Text textAlign={TextAlign.CENTER}>Выравнивание по центру</Text>
					<Text textAlign={TextAlign.RIGHT}>Выравнивание по правому краю</Text>
					<Text textAlign={TextAlign.JUSTIFY}>
						Выравнивание по ширине. Justified text looks neat in narrow columns,
						but can create awkward gaps in short lines.
					</Text>
				</section>

				<section className={cls.section}>
					<h2>7. Семантические теги</h2>

					<h3>Заголовки (только с type=TITLE)</h3>
					<Text type={TextType.TITLE} tag={TitleTag.H1}>
						Тег H1
					</Text>
					<Text type={TextType.TITLE} tag={TitleTag.H2}>
						Тег H2
					</Text>
					<Text type={TextType.TITLE} tag={TitleTag.H3}>
						Тег H3 (по умолчанию)
					</Text>
					<Text type={TextType.TITLE} tag={TitleTag.H4}>
						Тег H4
					</Text>

					<h3>Текстовые теги (только с type=TEXT)</h3>
					<Text tag={TextTag.P}>Тег P (по умолчанию)</Text>
					<Text tag={TextTag.SPAN}>Тег SPAN (встроенный)</Text>
					<Text tag={TextTag.DIV}>Тег DIV (блочный)</Text>
				</section>

				<section className={cls.section}>
					<h2>8. Комбинированные примеры</h2>
					<Text
						type={TextType.TITLE}
						tag={TitleTag.H2}
						fontSize={TextSize.XL}
						fontWeight={FontWeight.SEMI_BOLD}
						color={TextColor.ACCENT}
						textAlign={TextAlign.CENTER}
						uppercase
					>
						важное уведомление
					</Text>

					<div className={cls.demoBox}>
						<Text
							color={TextColor.ERROR}
							fontSize={TextSize.S}
							margin='8px 0 0'
							truncate
						>
							Ошибка: очень длинное сообщение об ошибке, которое должно
							обрезаться...
						</Text>
					</div>
					<Text type={TextType.TITLE} tag={TitleTag.H3} fontSize={TextSize.XXL}>
						Подтвердите вход
					</Text>

					<div className={cls.cardWrapper}>
						<div className={cls.titleWrapper}>
							<Text
								type={TextType.TITLE}
								tag={TitleTag.H4}
								fontSize={TextSize.L}
							>
								Сергей Евтушенко
							</Text>
							<VolumeOff className={cls.icon} />
						</div>
						<Text
							type={TextType.TEXT}
							tag={TextTag.SPAN}
							fontSize={TextSize.S}
							maxLines={TextClamp.LINES_2}
						>
							Привет. Я оставил две стремянки и два шуруповёрта. Один в кейсе, а
							другой просто так. Одна батарейка может кончиться, тогда будете
							одним добивать. Воды с собой возьмите, там ничего уже не осталось.
						</Text>
						<Text
							type={TextType.TEXT}
							tag={TextTag.SPAN}
							fontSize={TextSize.XL}
							color={TextColor.ACCENT}
							maxLines={TextClamp.LINES_3}
							margin='25px'
						>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu fugiat
							nulla pariatur. Excepteur sint occaecat cupidatat non proident,
							sunt in culpa qui officia deserunt mollit anim id est laborum. Sed
							ut perspiciatis unde omnis iste natus error sit voluptatem
							accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
							quae ab illo inventore veritatis et quasi architecto beatae vitae
							dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
							aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
							eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
							est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
							velit, sed quia non numquam eius modi tempora incidunt ut labore
							et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
							veniam, quis nostrum exercitationem ullam corporis suscipit
							laboriosam, nisi ut aliquid ex ea commodi consequatur?
						</Text>
					</div>
				</section>
			</div>
		</div>
	);
};
