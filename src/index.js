import "./vauxs-archive.postcss";

import { registerSettings } from "$lib/settings.js";
import { annoy } from "$lib/utils.js";
import { VArchChatLogHook } from "./view/ChatLog.js";
import { registerReplaceButtons } from "./replaceButtons.js";

Hooks.once("init", () => registerSettings());

Hooks.once("setup", () => registerReplaceButtons());

Hooks.once("ready", () => {
	VArchChatLogHook();

	annoy();
});

