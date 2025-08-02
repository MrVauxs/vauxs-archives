import moduleJSON from "moduleJSON" with { type: "json" };
import { initVaChatLog } from "./VAChatLog/index.svelte";

Hooks.on("ready", () => {
	ui.notifications.info(`Running ${moduleJSON.id}!`);

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
