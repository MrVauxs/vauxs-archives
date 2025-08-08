import { SvelteApplication } from "#runtime/svelte/application";
import ArchiveShell from "./ArchiveShell.svelte";

export default class ArchiveApplication extends SvelteApplication {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: "vauxs-archives.title", // Automatically localized from `lang/en.json`.
			id: "vauxs-archive",
			width: 900,
			height: 600,
			classes: ["vauxs-archive"],
			headerIcon: "modules/vauxs-archives/assets/Face16px.gif",
			resizable: true,
			svelte: {
				class: ArchiveShell,
				target: document.body,
			},
		});
	}

	_getHeaderButtons() {
		const buttons = super._getHeaderButtons();
		buttons.unshift({
			icon: "fas fa-mug-hot ko-fi",
			label: "vauxs-archives.support",
			onclick: () => {
				window.open("https://ko-fi.com/mrvauxs", "_blank");
			},
		});
		return buttons;
	}
}

let archiveMenu;

/**
 * Opens the archive menu.
 *
 * @returns {ArchiveApplication} The archive menu instance.
 */
export function openArchive() {
	archiveMenu = archiveMenu ? archiveMenu : new ArchiveApplication();
	archiveMenu.render(true, { focus: true });

	return archiveMenu;
}

export class ArchiveShim extends FormApplication {
	constructor(options = {}) {
		super({}, options);

		openArchive();
	}

	render() {
		this.close();
	}
}

