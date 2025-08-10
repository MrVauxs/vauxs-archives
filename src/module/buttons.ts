import type ChatLog from "foundry-pf2e/foundry/client/applications/sidebar/tabs/chat.mjs";
import { settings } from "./settings.svelte";

const renderChat = Hooks.on("renderChatInput", (_: ChatLog, htmlObj: any) => {
	const rollButtons = htmlObj["#roll-privacy"] as HTMLElement;
	if (settings.putButtonInRolls) addArchiveButton(rollButtons);

	const chatControls = (htmlObj["#chat-controls"] as HTMLElement).querySelector(".control-buttons")!;
	if (!settings.putButtonInRolls) addArchiveButton(chatControls as HTMLElement);

	const archiveButton = rollButtons.parentElement!.querySelector("[data-action=\"export\"]");
	if (archiveButton && settings.replaceButtons) {
		archiveButton.remove();
	}

	const deleteButton = chatControls.querySelector("[data-action=\"flush\"]");
	if (deleteButton && settings.removeButton) {
		deleteButton.remove();
	}
});

function addArchiveButton(el: HTMLElement) {
	if (el.querySelector("#vauxs-archives")) return;

	const parent = document.createElement("div");
	parent.innerHTML = `<button type="button" id="vauxs-archives" class="ui-control icon fa-solid fa-archive" data-tooltip="Open Vauxs Archives" aria-label="Open Vauxs Archives"></button>`;
	const element = parent.firstChild!;

	element.addEventListener(
		"click",
		() => { window.vauxsArchives.ArchiveMenu.start(); },
	);

	el.appendChild(element);
}

if (import.meta.hot) {
	import.meta.hot.accept();
	import.meta.hot.dispose(() => {
		Hooks.off("renderChatInput", renderChat);
	});
}
