import {
	Button,
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import { Microphone } from '@icons/index';

export function VoiceButton() {
	return (
		<Button
			theme={ButtonTheme.CIRCLE}
			color={ButtonColor.TRANSPARENT}
			btnType={ButtonType.BUTTON}
		>
			<Microphone />
		</Button>
	);
}
