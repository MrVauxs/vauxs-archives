import { TJSGameSettings } from "#runtime/svelte/store/fvtt/settings";
import { writable, get } from "svelte/store";
import { ArchiveShim } from "../view/ArchiveApplication";

export const mId = "vauxs-archives";

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
			name: "vauxs-archives.settings.loadLastArchive.title",
			hint: "vauxs-archives.settings.loadLastArchive.hint",
			scope: "user",
			config: true,
			type: Boolean,
			default: false,
		},
	},
	/* {
		folder: mId,
		namespace: mId,
		key: "replaceButtons",
		options: {
			name: "vauxs-archives.settings.replaceButtons.title",
			hint: "vauxs-archives.settings.replaceButtons.hint",
			scope: "world",
			config: true,
			type: Boolean,
			default: true,
		},
	}, */
	{
		folder: mId,
		namespace: mId,
		key: "archives",
		options: {
			name: "vauxs-archives.settings.archives.title",
			hint: "vauxs-archives.settings.archives.hint",
			scope: "world",
			config: false,
			type: Array,
			default: [],
		},
	},
];

export const archives = writable(new Map([]));

/**
 * Registers the settings.
 */
export function registerSettings() {
	settings.registerAll(array);

	game.settings.registerMenu(mId, "chat-archive", {
		name: "vauxs-archives.settings.archive.title",
		hint: "vauxs-archives.settings.archive.hint",
		label: "vauxs-archives.settings.archive.button",
		icon: "fas fa-message",
		type: ArchiveShim,
	});

	archives.set(new Map(game.settings.get("vauxs-archives", "archives")));

	game.modules.get(mId).api = {
		get loadLastArchiveStore() {
			return settings.getStore("loadLastArchive");
		},
		get archivesMap() {
			return get(archives);
		},
		get archivesSetting() {
			return game.settings.get("vauxs-archives", "archives");
		},
		VArchChatLogClass: null,
	};

	archives.subscribe((value) => {
		console.log("Updating archives", value);
		game.settings.set("vauxs-archives", "archives", Array.from(value));
	});
}

