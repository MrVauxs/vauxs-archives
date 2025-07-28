import { dev, annoy } from "$lib/utils.js";
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
			if (input === void 0 || !input.length) {
				ui.notifications.error("Vauxs Archives ChatLog encountered an error. See console log for details.", input);
				throw Error("VArchChatLog requires a collection of messages");
			}
			this.messages = input.map((m) => new game.messages.documentClass(m));
			this.messagesStore = writable(this.messages);
			this.firstLoad = true;

			this.messagesStore.subscribe((value) => {
				if (!$(this.element).hasClass("vce-chat-archive-log")) return; // Don't update the wrong chatlog
				this.messages = value;
				this.lastId = null;
				$(this.element).find(".chat-log").empty();
				this.renderBatch(CONFIG.ChatMessage.batchSize).then(() =>
					this.scrollBottom({ waitImages: true })
				);

				if (dev) console.log("ChatLog updated", this.messages);
			});

			annoy();
		}

		static DEFAULT_OPTIONS = {
			classes: ["vce-chat-archive-log"]
		};

		get popout() {
			return this.VApopout?.deref();
		}

		VApopout;
		lastId;
		VArenderingQueue = new foundry.utils.Semaphore(1);
		VArenderingBatch = false;

		// TODO: REPLACE IN V12 WITH { contents : this.messages } OR EQUIVALENT
		get collection() {
			return this.messages;
		}

		// Altered copy of renderPopout
		renderPopout() {
			if (this.VApopout) return this.VApopout.render({ force: true });
			const options = foundry.utils.mergeObject(this.options, {
			id: `${this.options.vArchData.id}-chat-popout`,
			window: {
				title: this.options.vArchData.title ?? game.i18n.localize("CHAT.Title"),
				frame: true,
				positioned: true,
				minimizable: true,
				resizable: true
			},
			}, { inplace: false });
			options.classes.push("sidebar-popout");
			this.VApopout = new WeakRef(new this.constructor(options, this.messages));
			this.VApopout.deref()._original = this;
			return this.VApopout.deref().render({ force: true });
		}

		// Altered copy of renderBatch
		async renderBatch(size) {
			if (this.VArenderingBatch) return;
			this.VArenderingBatch = true;
			return this.VArenderingQueue.add(this.VAdoRenderBatch.bind(this), size);
		}

		// Altered copy of #doRenderedBatch
		async VAdoRenderBatch(size) {
			if (!this.rendered) {
			this.VArenderingBatch = false;
			return;
			}

			const messages = this.messages;
			const log = this.element.querySelector(".chat-log");

			// Get the index of the last rendered chat message
			let lastIdx = messages.findIndex((m) => m.id === this.lastId);
			lastIdx = lastIdx > -1 ? lastIdx : messages.length;
			if (!lastIdx) {
				this.VArenderingBatch = false;
				return;
			}

			// Get the next batch to render
			const targetIdx = Math.max(lastIdx - size, 0);
			const elements = [];
			for (let i = targetIdx; i < lastIdx; i++) {
				const message = messages[i];
				if (!message.visible) continue;
				message.logged = true;
				try {
					elements.push(await this.constructor.renderMessage(message));
				} catch (err) {
					console.error("ChatLog##doRenderBatch", err, {
						msg: `Chat message ${message.id} failed to render`,
						log: "error"
					});
				}
			}

			// Prepend the HTML
			log.prepend(...elements);
			this.lastId = messages[targetIdx].id;
			this.VArenderingBatch = false;
		}

		// Empty copy of _getEntryContextOptions to stop a right-click context menu from appearing that will generate an error
		_getEntryContextOptions() {
			return [];
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
		$(html).find("#chat-message").remove();
		$(html).find(".chat-controls").remove();
		$(html).find(".window-content").css('padding', 0);

		// Add Searchbar.svelte
		app._svelte = new Searchbar({
			target: $(html).find('.window-content').get(0),
			props: { app },
		});
	});
}

