import { registerSettings } from "$lib/settings.js";
import { dev } from "$lib/utils.js";
import ArchiveApplication from "./view/ArchiveApplication.js";
import "./vauxs-archive.postcss";
import { VArchChatLogHook } from "./view/ChatLog.js";

if (dev) Hooks.once("ready", () => new ArchiveApplication().render(true, { focus: true }));

Hooks.once("init", () => {
	registerSettings();
	VArchChatLogHook();
});

