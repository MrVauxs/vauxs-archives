import type { Settings } from "../module/settings.svelte";

const { FilePicker } = foundry.applications.apps;

export interface Data {
	id: string;
	location: string;
	title: string;
	timestamp: number;
	description: string;
}

interface Options {
	deleteMessages?: true;
	deleteAll?: true;
}

export async function archiveMessages(data: Partial<Data>, messages: ChatMessage["_source"][], options: Options) {
	ui.notifications.info("Archiving messages...");

	data.id ??= foundry.utils.randomID();
	data.location ??= `worlds/${game.world.id}/chat-archives/${data.id}.json`;
	data.title ??= `Archive ${data.id.slice(0, 4)}; ${new Date(Date.now()).toDateString()}`;
	data.timestamp ??= Date.now();

	const json = JSON.stringify({ data, messages }, null, "\t");
	const file = new File([json], `${data.id}.json`, { type: "application/json" });
	const folderPath = data.location.split("/").slice(0, -1).join("/");
	const worldPath = folderPath.split("/").slice(0, -1).join("/");

	// Check if chat-archives folder exists, create if not.
	await foundry.applications.apps.FilePicker.browse("data", worldPath).then(async (result) => {
		if (!result.dirs.includes(folderPath)) {
			await FilePicker.createDirectory("data", folderPath);
		}
	});

	const response = await FilePicker.upload("data", folderPath, file);

	if (response && response.status === "success") {
		addToArchives({ ...data, location: response.path } as Data);

		if (options.deleteMessages) {
			ChatMessage.deleteDocuments(
				messages.map(message => message.id as string),
				{ deleteAll: options.deleteAll },
			);
		}
	}

	return response;
}

export function addToArchives(data: Data) {
	const archives = game.settings.get("vauxs-archives", "archives") as Settings["archives"];
	game.settings.set("vauxs-archives", "archives", [...archives, data]);
}
