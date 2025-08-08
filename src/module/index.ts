import { initVaChatLog } from "./VAChatLog/index.svelte";
import "./buttons.ts";

Hooks.on("ready", () => {
	window.vauxsArchives.VAChatLog = initVaChatLog();
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
