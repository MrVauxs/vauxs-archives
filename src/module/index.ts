import type { Data } from "$lib/utils.ts";
import { id } from "moduleJSON";
import { settings } from "./settings.svelte.ts";
import { initVaChatLog } from "./VAChatLog/index.svelte";
import "./buttons.ts";

Hooks.on("ready", () => {
	window.vauxsArchives.VAChatLog = initVaChatLog();

	// V12 -> V13
	const archives = settings.archives as Data[] | [string, Data][];
	if (archives.find(x => Array.isArray(x) || typeof x !== "object")) {
		const fixedArchives = archives.map(x => Array.isArray(x) ? x[1] : x).filter(Boolean);
		game.settings.set(id, "archives", fixedArchives);
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(
		"./VAChatLog/index.svelte",
		async (VAChatLogApp) => {
			if (VAChatLogApp?.initVaChatLog) {
				// eslint-disable-next-line no-console
				console.log("HMR VAChatLog");
				window.vauxsArchives.VAChatLog = initVaChatLog();
			}
		},
	);
}
