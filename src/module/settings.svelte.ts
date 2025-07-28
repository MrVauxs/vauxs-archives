import type { Data } from "$lib/utils";
import type { SettingRegistration } from "foundry-pf2e/foundry/client/helpers/client-settings.mjs";
import { readonly } from "$lib/utils";
import { id } from "moduleJSON";

export interface Settings {
	loadLastArchive: boolean;
	replaceButtons: boolean;
	removeButton: boolean;
	archives: Data[];
}

const settings: Settings = $state({
	loadLastArchive: false,
	replaceButtons: true,
	removeButton: false,
	archives: [],
});

const setData: (SettingRegistration & { key: string })[] = [
	{
		key: "loadLastArchive",
		name: "vauxs-archives.settings.loadLastArchive.title",
		hint: "vauxs-archives.settings.loadLastArchive.hint",
		scope: "user",
		config: true,
		type: Boolean,
		onChange: (value) => { settings.loadLastArchive = value as boolean; },
		default: false,
	},
	{
		key: "replaceButtons",
		name: "vauxs-archives.settings.replaceButtons.title",
		hint: "vauxs-archives.settings.replaceButtons.hint",
		scope: "world",
		config: true,
		type: Boolean,
		default: true,
		onChange: (value) => { settings.replaceButtons = value as boolean; },
		requiresReload: true,
	},
	{
		key: "removeButton",
		name: "vauxs-archives.settings.removeButton.title",
		hint: "vauxs-archives.settings.removeButton.hint",
		scope: "world",
		config: true,
		type: Boolean,
		default: false,
		onChange: (value) => { settings.removeButton = value as boolean; },
		requiresReload: true,
	},
	{
		key: "archives",
		name: "vauxs-archives.settings.archives.title",
		hint: "vauxs-archives.settings.archives.hint",
		scope: "world",
		config: false,
		type: Array,
		onChange: (value) => { settings.archives = value as Data[]; },
		default: [],
	},
];

Hooks.once("init", () => {
	for (const set of setData) {
		game.settings.register(id, set.key, set);
	}

	for (const set of setData) {
		// @ts-expect-error Never say never
		settings[set.key as keyof Settings] = game.settings.get(id, set.key);
	}
});

const readonlySettings = readonly(settings);

export { readonlySettings as settings };
