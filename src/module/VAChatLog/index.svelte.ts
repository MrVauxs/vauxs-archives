import type { ApplicationConfiguration } from "foundry-pf2e/foundry/client/applications/_types.mjs";
import type ChatLog from "foundry-pf2e/foundry/client/applications/sidebar/tabs/chat.mjs";

export function initVaChatLog() {
	// runtime
	const ChatLogCls = game.messages.directory!.constructor as unknown as new (...a: any[]) => ChatLog;
	const ChatMessageCls = game.messages.documentClass as unknown as new (...a: any[]) => ChatMessage;

	interface Options {
		vaData: {
			id?: string;
			title?: string;
		};
	}

	interface VAChatLogConstructor {
		new (...args: any[]): ChatLog;
	}

	return class VAChatLog extends ChatLogCls {
		declare options: ApplicationConfiguration & Options;
		messages: ChatMessage[] = $state([]);
		firstLoad: boolean;

		constructor(options: Options, input: ReturnType<ChatMessage["toJSON"]>[]) {
			super(options);
			if (input === void 0 || !input.length) {
				ui.notifications.error("Vauxs Archives ChatLog encountered an error. See console log for details.", input as any);
				throw new Error("VArchChatLog requires a collection of messages");
			}
			this.messages = input.map(m => new ChatMessageCls(m));
			this.firstLoad = true;
		}

		static DEFAULT_OPTIONS = {
			classes: ["vce-chat-archive-log"],
			vaData: {},
		};

		VApopout?: any;
		lastId?: string;
		VArenderingQueue = new foundry.utils.Semaphore(1);
		VArenderingBatch = false;

		// Altered copy of renderPopout
		override renderPopout() {
			if (this.VApopout) return this.VApopout.render({ force: true });
			const options = foundry.utils.mergeObject(this.options, {
				id: `${this.options.vaData.id ?? "unknown"}-chat-popout`,
				window: {
					title: this.options.vaData.title ?? game.i18n.localize("CHAT.Title"),
					frame: true,
					positioned: true,
					minimizable: true,
					resizable: true,
				},
			}, { inplace: false });
			options.classes.push("sidebar-popout");
			this.VApopout = new WeakRef(new (this.constructor as VAChatLogConstructor)(options, this.messages));
			this.VApopout.deref()._original = this;
			return this.VApopout.deref().render({ force: true });
		}

		// Altered copy of renderBatch
		override async renderBatch(size: number) {
			if (this.VArenderingBatch) return;
			this.VArenderingBatch = true;
			return this.VArenderingQueue.add(this.VAdoRenderBatch.bind(this), size);
		}

		// Altered copy of #doRenderedBatch
		async VAdoRenderBatch(size: number) {
			if (!this.rendered) {
				this.VArenderingBatch = false;
				return;
			}

			const messages = this.messages;
			const log = this.element.querySelector(".chat-log");
			if (!log) {
				throw new Error("Could not find .chat-log element.");
			}

			// Get the index of the last rendered chat message
			let lastIdx = messages.findIndex(m => m.id === this.lastId);
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
					elements.push(await (this.constructor as unknown as typeof foundry.applications.sidebar.tabs.ChatLog).renderMessage(message));
				} catch (err) {
					console.error("ChatLog##doRenderBatch", err, {
						msg: `Chat message ${message.id} failed to render`,
						log: "error",
					});
				}
			}

			// Prepend the HTML
			log.prepend(...elements);
			this.lastId = messages[targetIdx].id;
			this.VArenderingBatch = false;
		}

		// Empty copy of _getEntryContextOptions to stop a right-click context menu from appearing that will generate an error
		override _getEntryContextOptions() {
			return [];
		}
	};
}
