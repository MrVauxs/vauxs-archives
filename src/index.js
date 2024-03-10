import { registerSettings } from "$lib/settings.js";
import ArchiveApplication from "./view/ArchiveApplication.js";
import "./vauxs-archive.postcss";

if (import.meta.env.DEV) Hooks.once("ready", () => new ArchiveApplication().render(true, { focus: true }));

Hooks.once("init", () => {
	registerSettings();
});

