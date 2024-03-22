/* eslint-disable prefer-const, no-shadow */
export default class VArchChatLog extends ChatLog {
	constructor(options, input) {
		super(options);
		if (input === undefined || !input.length) {
			ui.notifications.error("Vauxs Archives ChatLog encountered an error. See console log for details.");
			throw Error("VArchChatLog requires a collection of messages");
		}
		this.messages = input.map((m) => new ChatMessage(m));
	}

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["vce-chat-archive-log"],
			resizable: true,
		});
	}

	get collection() {
		return this.messages;
	}

	// https://github.com/foundryvtt/foundryvtt/issues/10587
	createPopout() {
		if (this._popout) return this._popout;
		const pop = new this.constructor({ popOut: true }, this.messages);
		this._popout = pop;
		pop._original = this;
		return pop;
	}

	// https://github.com/foundryvtt/foundryvtt/issues/10588
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
}

/**
 * Hooks into the whenever VArchChatLog is rendered.
 */
export function VArchChatLogHook() {
	Hooks.on("renderVArchChatLog", (app, html) => {
		$(html).find("#chat-form").remove();
		$(html).find("#chat-controls").remove();
	});
}

