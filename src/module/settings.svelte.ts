import type { Data } from "$lib/utils";
import type { SettingRegistration } from "foundry-pf2e/foundry/client/helpers/client-settings.mjs";
import { readonly } from "$lib/utils";
import { id } from "moduleJSON";

export interface Settings {
	replaceButtons: boolean;
	removeButton: boolean;
	archives: Data[];
	putButtonInRolls: boolean;
}

const settings: Settings = $state({
	replaceButtons: true,
	removeButton: false,
	putButtonInRolls: false,
	archives: [],
});

const setData: (SettingRegistration & { key: string })[] = [
	{
		key: "replaceButtons",
		name: "vauxs-archives.settings.replaceButtons.title",
		hint: "vauxs-archives.settings.replaceButtons.hint",
		scope: "user",
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
		scope: "user",
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
	{
		key: "putButtonInRolls",
		name: "vauxs-archives.settings.putButtonInRolls.title",
		hint: "vauxs-archives.settings.putButtonInRolls.hint",
		scope: "user",
		config: true,
		type: Boolean,
		default: false,
		onChange: (value) => { settings.removeButton = value as boolean; },
		requiresReload: true,
	},
];

Hooks.once("init", () => {
	for (const set of setData) {
		game.settings.register(id, set.key, set);
	}

	for (const set of setData) {
		const setting = game.settings.get(id, set.key);
		// @ts-expect-error Never say never
		settings[set.key as keyof Settings] = setting;
	}
});

const readonlySettings = readonly(settings);

export { readonlySettings as settings };
