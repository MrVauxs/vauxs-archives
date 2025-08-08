import { SvelteApplicationMixin } from "$lib/SvelteMixin.svelte";
import Root from "./app.svelte";

export class ArchiveCreator extends SvelteApplicationMixin(foundry.applications.api.ApplicationV2) {
	static override DEFAULT_OPTIONS = {
		classes: ["vce-chat-archive-creator"],
		position: {},
		window: {
			icon: "fa-solid fa-archive",
			title: "Create an Archive",
		},
	};

	static async start() {
		return new ArchiveCreator().render({ force: true });
	}

	protected override async _prepareContext() {
		return {
			foundryApp: this,
		};
	}

	protected override root = Root;
}
