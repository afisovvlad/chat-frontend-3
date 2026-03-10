import { exec } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

function convertToOgg(input: string, output: string) {
	return new Promise((resolve, reject) => {
		exec(`ffmpeg -i "${input}" -c:a libopus "${output}"`, error =>
			error ? reject(error) : resolve(true)
		);
	});
}

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const file = formData.get('voice') as File;

		if (!file) {
			return Response.json({ error: 'No file' }, { status: 400 });
		}

		const id = crypto.randomUUID();
		const tmpDir = os.tmpdir();

		const webmPath = path.join(tmpDir, `${id}.webm`);
		const oggPath = path.join(tmpDir, `${id}.ogg`);

		// сохраняем webm
		const buffer = Buffer.from(await file.arrayBuffer());
		fs.writeFileSync(webmPath, buffer);

		// конвертация
		await convertToOgg(webmPath, oggPath);

		// читаем ogg
		const oggBuffer = fs.readFileSync(oggPath);

		// удаляем временный webm и ogg
		fs.unlinkSync(webmPath);
		fs.unlinkSync(oggPath);

		// base64
		const base64 = oggBuffer.toString('base64');
		const filename = `${id}.ogg`;

		return Response.json({ base64, filename });
	} catch (error) {
		console.error(error);
		return Response.json({ error: 'Voice conversion failed' }, { status: 500 });
	}
}
