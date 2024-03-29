import { settings } from "$lib/settings.js";
import { get } from "svelte/store";
import { createArchive } from "./view/ArchiveShell.svelte";
import { openArchive } from "./view/ArchiveApplication.js";

/**
 * Registers the hook to replace archival buttons in the chat log.
 */
export function registerReplaceButtons() {
	const replaceButtons = settings.getStore("replaceButtons");
	const removeButton = settings.getStore("removeButton");
	if (get(replaceButtons)) {
		Hooks.on("renderChatLog", (app, html) => {
			const button = $(html).find(".export-log");

			// Remove original Foundry functionality
			button.unbind();
			// Replace the tooltip
			button.attr("data-tooltip", "vauxs-archives.create");
			button.attr("data-tooltip-position", "top");
			button.find("i").removeClass("fa-save").addClass("fa-archive");
			// Open the archive creation dialog
			button.bind("click", () => createArchive());
			button.bind("contextmenu", () => openArchive());
		});
	}

	if (get(removeButton)) {
		Hooks.on("renderChatLog", (app, html) => {
			$(html).find(".delete.chat-flush")?.remove?.();

			$(html).find(".control-buttons").addClass("no-flush-button");
		});
	}
}

