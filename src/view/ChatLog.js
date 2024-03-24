import { dev } from "$lib/utils.js";
import { writable } from "svelte/store";
import Searchbar from "./Searchbar.svelte";
import { mId } from "../lib/settings";

/**
 * Registers the VArchChatLog class.
 *
 * @returns {typeof VArchChatLogClass} The VArchChatLog class.
 */
function registerChatLog() {
	/* eslint-disable prefer-const, no-shadow */
	return class VArchChatLog extends game.messages.directory.constructor {
		constructor(options, input) {
			super(options);
			if (input === undefined || !input.length) {
				ui.notifications.error("Vauxs Archives ChatLog encountered an error. See console log for details.");
				throw Error("VArchChatLog requires a collection of messages");
			}
			this.messages = input.map((m) => new game.messages.documentClass(m));

			this.messagesStore = writable(this.messages);
			this.firstLoad = true;

			this.messagesStore.subscribe((value) => {
				if (!$(this.element).hasClass("vce-chat-archive-log")) return; // Don't update the wrong chatlog
				this.messages = value;
				this._lastId = null;
				$(this.element).find("#chat-log").empty();
				this._renderBatch(this.element, CONFIG.ChatMessage.batchSize).then(() =>
					this.scrollBottom({ waitImages: true })
				);

				if (dev) console.log("ChatLog updated", this.messages);
			});
		}

		static get defaultOptions() {
			return foundry.utils.mergeObject(super.defaultOptions, {
				classes: ["vce-chat-archive-log"],
				resizable: true,
			});
		}

		// TODO: REPLACE IN V12 WITH { contents : this.messages } OR EQUIVALENT
		get collection() {
			return this.messages;
		}

		// https://github.com/foundryvtt/foundryvtt/issues/10587
		// TODO: CHECK BACK IN V12
		createPopout() {
			if (this._popout) return this._popout;
			const pop = new this.constructor({ popOut: true }, this.messages);
			this._popout = pop;
			pop._original = this;
			return pop;
		}

		// https://github.com/foundryvtt/foundryvtt/issues/10588
		// TODO: REMOVE IN V12
		async _renderBatch(html, size) {
			const messages = this.collection;
			const log = html.find("#chat-log, #chat-log-popout");
			// Get the index of the last rendered message
			let lastIdx = messages.findIndex((m) => m.id === this._lastId);
			lastIdx = lastIdx !== -1 ? lastIdx : messages.length;

			// Get the next batch to render
			let targetIdx = Math.max(lastIdx - size, 0);
			let m = null;
			if (lastIdx !== 0) {
				let html = [];
				for (let i = targetIdx; i < lastIdx; i++) {
					m = messages[i];
					if (!m.visible) continue;
					m.logged = true;
					try {
						html.push(await m.getHTML());
					} catch (err) {
						err.message = `Chat message ${m.id} failed to render: ${err})`;
						console.error(err);
					}
				}

				// Prepend the HTML
				log.prepend(html);
				this._lastId = messages[targetIdx].id;
			}
		}
	};
}

/**
 * Hooks into the whenever VArchChatLog is rendered.
 */
export function VArchChatLogHook() {
	game.modules.get(mId).api.VArchChatLogClass = registerChatLog();

	Hooks.on("renderVArchChatLog", (app, html) => {
		if (!$(html).hasClass("vce-chat-archive-log")) return;
		$(html).find("#chat-form").remove();
		$(html).find("#chat-controls").remove();

		// Add Searchbar.svelte
		app._svelte = new Searchbar({
			target: html[0],
			props: { app },
		});
	});
}

