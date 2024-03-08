import { TJSGameSettings } from "#runtime/svelte/store/fvtt/settings";
import { ArchiveShim } from "../view/ArchiveApplication";

export const mId = "vauxs-archival";

/**
 * @type {TJSGameSettings}
 */
export const settings = new TJSGameSettings(mId);

const array = [
	{
		folder: mId,
		namespace: mId,
		key: "loadLastArchive",
		options: {
			name: "vauxs-archival.settings.loadLastArchive.title",
			hint: "vauxs-archival.settings.loadLastArchive.hint",
			scope: "user",
			config: true,
			type: Boolean,
			default: false,
		},
	},
	{
		folder: mId,
		namespace: mId,
		key: "replaceButtons",
		options: {
			name: "vauxs-archival.settings.replaceButtons.title",
			hint: "vauxs-archival.settings.replaceButtons.hint",
			scope: "world",
			config: true,
			type: Boolean,
			default: true,
		},
	},
	{
		folder: mId,
		namespace: mId,
		key: "archives",
		options: {
			name: "vauxs-archival.settings.archives.title",
			hint: "vauxs-archival.settings.archives.hint",
			scope: "world",
			config: false,
			type: Array,
			default: [],
		},
	},
];

/**
 * Registers the settings.
 */
export function registerSettings() {
	settings.registerAll(array);

	game.settings.registerMenu(mId, "chat-archive", {
		name: "vauxs-archival.settings.archive.title",
		hint: "vauxs-archival.settings.archive.hint",
		label: "vauxs-archival.settings.archive.button",
		icon: "fas fa-message",
		type: ArchiveShim,
	});
}

