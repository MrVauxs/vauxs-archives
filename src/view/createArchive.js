import { validateObject, i } from "$lib/utils.js";
import ArchiveCreator from "./ArchiveCreator.svelte";
import { TJSDialog } from "#runtime/svelte/application";
import { archives } from "$lib/settings.js";

/**
 * Creates an object with default values for an archive.
 *
 * @param {object} input The input data for the archive.
 *
 * @returns {object} The archive data object.
 */
export function dataObj(input = {}) {
	Object.keys(input).forEach((key) => input[key] === undefined && delete input[key]); // Remove undefined keys

	const id = foundry.utils.randomID();
	const data = foundry.utils.mergeObject(
		{
			id,
			title: `Archive ${id.slice(0, 4)}; ${new Date(Date.now()).toDateString()}`,
			timestamp: Date.now(),
			description: "",
			location: `worlds/${game.world.id}/chat-archives/${id}.json`,
		},
		input
	);
	return data;
}

/**
 * Creates an archive from the current chat log.
 *
 * @param {object} event The event that triggered the creation of the archive.
 *
 * @param {object} input The input data for the archive.
 *
 * @returns {Promise<void>} A promise that resolves when the archive is created.
 */
export async function createArchive(event, input) {
	const data = dataObj(input);

	if (!game.messages.size) return ui.notifications.error("No messages found!");

	const result = await TJSDialog.wait({
		// modal: true,
		title: i("modal.create.title"),
		zIndex: 1000,
		content: { class: ArchiveCreator, props: { data, event } },
	});

	const validated = validateObject(
		{
			id: "string",
			title: "string",
			timestamp: "number",
			description: "string",
			location: "string",
		},
		result
	);

	if (validated) {
		archives.update((value) => {
			return value.set(result.id, result);
		});
	}
}

