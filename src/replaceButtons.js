import { settings } from "$lib/settings.js";
import { get } from "svelte/store";
import { createArchive } from "./view/createArchive.js";
import { openArchive } from "./view/ArchiveApplication.js";

/**
 * Registers the hook to replace archival buttons in the chat log.
 */
export function registerReplaceButtons() {
	const replaceButtons = settings.getStore("replaceButtons");
	const removeButton = settings.getStore("removeButton");
	if (get(replaceButtons)) {
		Hooks.on("renderChatLog", (app, html) => {
			const button = $(html).find(`[data-action="export"]`);

			// Remove original Foundry functionality
			button.unbind();
			button.attr("data-action", "");

			// Replace the tooltip
			button.attr("data-tooltip", "vauxs-archives.createOrOpen");
			button.attr("data-tooltip-position", "top");
			button.removeClass("fa-floppy-disk").addClass("fa-archive");

			// Open the archive creation dialog
			button.on("click", () => createArchive());
			button.on("contextmenu", () => openArchive());
		});
	}

	if (get(removeButton)) {
		Hooks.on("renderChatLog", (app, html) => {
			$(html).find(`[data-action="flush"]`).remove();

			$(html).find(".control-buttons").addClass("no-flush-button");
		});
	}
}

