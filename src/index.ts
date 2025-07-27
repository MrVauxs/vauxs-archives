import { ArchiveMenu } from "./module/Archive";
import { settings } from "./module/settings.svelte";
import "./styles/main.css";
import "./module";

window.vauxsArchives = {
	ArchiveMenu,
	settings,
};

if (import.meta.hot) {
	import.meta.hot.accept([
		"./module/Archive",
	], async ([archiveApp]) => {
		if (archiveApp?.ArchiveMenu) {
			// eslint-disable-next-line no-console
			console.log("HMR pick function");
			window.vauxsArchives.ArchiveMenu = archiveApp.ArchiveMenu;
		}
	});
}
