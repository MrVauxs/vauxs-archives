import type { ArchiveMenu } from "./module/Archive";
import type { Settings } from "./module/settings.svelte";
import type { initVaChatLog } from "./module/VAChatLog/index.svelte";

declare module "vite/types/customEvent.d.ts" {
	interface CustomEventMap {
		"foundryvtt-compendium-sync:vtt-update": { json: any; dir: string; once: boolean };
		"foundryvtt-compendium-sync:vtt-delete": { id: string; dir: string };
		// 'event-key': payload
	}
}

// Add window.foundrySync to the global scope
declare global {
	interface Window {
		foundrySync: Record<string, () => void>;
		vauxsArchives: {
			ArchiveMenu: typeof ArchiveMenu;
			settings: Settings;
			VAChatLog?: ReturnType<typeof initVaChatLog>;
		};
	}
}
