import type ChatLog from "foundry-pf2e/foundry/client/applications/sidebar/tabs/chat.mjs";

const renderChat = Hooks.on("renderChatLog", (_: ChatLog, html: HTMLElement) => {
	const rollButtons = html.querySelector(".control-buttons");
	if (!rollButtons) return;
	addArchiveButton(rollButtons as HTMLElement);
});

/* const renderChatSmall = Hooks.on("renderChatInput", (_: ChatLog, htmlObj: any) => {
	const rollButtons = htmlObj["#roll-privacy"] as HTMLElement;
	addArchiveButton(rollButtons);
}); */

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
		Hooks.off("renderChatLog", renderChat);
		// Hooks.off("renderChatInput", renderChatSmall);
	});
}
