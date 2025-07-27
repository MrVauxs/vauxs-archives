import type { SvelteApplicationRenderContext } from "$lib/SvelteMixin.svelte";
import type { ApplicationConfiguration } from "foundry-pf2e/foundry/client/applications/_types.mjs";
import { SvelteApplicationMixin } from "$lib/SvelteMixin.svelte";
import Root from "./app.svelte";

interface archiveOptions {

}

export interface SummonMenuContext extends SvelteApplicationRenderContext {
	data: SummonMenuState;
	foundryApp: ArchiveMenu;
}

interface SummonMenuState {
	options: archiveOptions;
}

export class ArchiveMenu extends SvelteApplicationMixin(foundry.applications.api.ApplicationV2) {
	static override DEFAULT_OPTIONS = {
		position: {
			width: 650,
			height: 500,
		},
		window: {
			icon: "fa-solid fa-archive",
			title: "Vauxs' Archives",
			resizable: true,
		},
	};

	static async start(options: archiveOptions) {
		return new ArchiveMenu({ summonOptions: options }).render({ force: true });
	}

	archiveOptions: archiveOptions;

	constructor(options: DeepPartial<ApplicationConfiguration> & { summonOptions?: archiveOptions }) {
		super(options);
		this.archiveOptions = options?.summonOptions || {};
	}

	protected override async _prepareContext(): Promise<SummonMenuContext> {
		return {
			foundryApp: this,
			data: {
				options: this.archiveOptions,
			},
		};
	}

	protected override root = Root;
}

if (import.meta.hot) {
	import.meta.hot.accept(async (newModule) => {
		if (!newModule) return;

		const reopenedDocuments: ArchiveMenu[] = [];

		for (const [_id, docClass] of foundry.applications.instances) {
			if (docClass.constructor.name === ArchiveMenu.name) {
				await docClass.close();
				reopenedDocuments.push(docClass as ArchiveMenu);
			};
		}

		for (const doc of reopenedDocuments) {
			new newModule.SummonMenu(doc.options).render({ force: true });
		}
	});
}
