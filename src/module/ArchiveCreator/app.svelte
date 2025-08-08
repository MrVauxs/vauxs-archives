<script lang="ts">
	import { archiveMessages, type Data } from "$lib/utils";
	import type { ArchiveCreator } from "./index.ts";

	let {foundryApp}: { foundryApp: ArchiveCreator } = $props()

	let data = $state({}) as Data;

	if (!game.messages.contents.length) throw ui.notifications.error("There are no messages to archive!")

	async function resolve() {
		await archiveMessages(data, messages, { deleteAll: archiveAll && deleteMessages, deleteMessages });
		foundryApp.close()
	}

	let deleteMessages = $state(false);
	let archiveAll = $state(false);
	let messages = $state(game.messages.contents as unknown as ChatMessage["_source"][]);

	// svelte-ignore state_referenced_locally
	let from = $state(new Date(messages.at(0)!.timestamp).toISOString().slice(0, 16));
	// svelte-ignore state_referenced_locally
	let to = $state(new Date(messages.at(-1)!.timestamp).toISOString().slice(0, 16));

	const offset = new Date().getTimezoneOffset() * 60 * 1000
	// Because miliseconds exist while date selectors work in seconds, we have to round up.
	const oneMinuteOffset = 60 * 1000

	$effect(() => {
		void from, to;
		if (archiveAll) {
			messages = game.messages.contents as unknown as ChatMessage["_source"][];
		} else {
			console.log("????")
			messages = game.messages.contents.filter((message) => {
				return (
					message.timestamp >= (new Date(from).getTime() - offset) &&
					message.timestamp <= (new Date(to).getTime() - offset + oneMinuteOffset)
				);
			}) as unknown as ChatMessage["_source"][];
		}
	});
</script>

<div>
  <div class="grid-container">
	<label class="contents">
	  Title
	  <input type="text" bind:value={data.title} />
	</label>

	<label class="contents">
	  Description
	  <input type="text" bind:value={data.description} placeholder="Archive Description" />
	</label>

	<div class="contents">
	  Archive all Messages
	  <input type="checkbox" class="auto-margin" bind:checked={archiveAll} />
	</div>

	{#if !archiveAll}
	  <div class="datetime-range-container">
		<span class="relative-span">
		  <label for="date-from">From</label>
		  <!-- svelte-ignore a11y_consider_explicit_label -->
		  <button
			class="undo-button fa-solid fa-undo"
			onclick={() => {
			  from = new Date(game.messages.contents.at(0)!.timestamp)
				.toISOString()
				.slice(0, 16);
			}}
		  >
		  </button>
		</span>
		<input type="datetime-local" bind:value={from} id="date-from" />
		<span class="relative-span">
		  <label for="date-to">To</label>
		  <!-- svelte-ignore a11y_consider_explicit_label -->
		  <button
			class="undo-button fa-solid fa-undo"
			onclick={() => {
			  to = new Date(game.messages.contents.at(-1)!.timestamp)
				.toISOString()
				.slice(0, 16);
			}}
		  >
		  </button>
		</span>
		<input type="datetime-local" bind:value={to} id="date-to" />
	  </div>
	{/if}

	<div class="contents">
	  <span class="relative-span">
		Delete Messages
		{#if game.modules.get("foundrytodiscord")?.active}
		  <span
			class="info-text-indicator"
			data-tooltip="You have <u>Foundry to Discord</u> enabled. Please note that the module ignores mass deletions (10+ messages), meaning that your Discord copies will not be removed."
			data-tooltip-direction="UP"
		  >
			(i)
		  </span>
		{/if}
	  </span>
	  <input type="checkbox" class="auto-margin" bind:checked={deleteMessages} />
	</div>
  </div>
  <div style="display: flex;justify-content: center;align-items: center;">
	<button onclick={resolve} disabled={!messages.length}>
	  Archive {deleteMessages ? "and delete" : ""}
	  {messages.length} / {game.messages.size} Messages
	</button>
  </div>
</div>

<style>
  .grid-container {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.25rem;
	text-align: center;
	margin-bottom: 0.25rem;
  }

  .grid-container label {
	line-height: 1.5rem;
  }

  .grid-container input {
	height: 1.5rem;
	margin-top: 0;
  }

  .contents {
	display: contents;
  }

  .auto-margin {
	margin-left: auto;
	margin-right: auto;
  }

  .datetime-range-container {
	grid-column: span 2 / span 2;
	flex-grow: 1;
	grid-row: span 2 / span 2;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.5rem;
  }

  .relative-span {
	position: relative;
	display: flex;
	justify-content: center;
  }

  .undo-button {
	font-family: "Font Awesome 6 Pro";
	border: none;
	background: transparent;
	cursor: pointer;
	font-size: 0.75em;
	align-self: last baseline;
  }

  .info-text-indicator {
	vertical-align: top;
	line-height: 1.5rem;
	text-decoration: underline;
	text-underline-offset: 0.125rem;
	margin-left: 0.125rem;
	font-size: 0.8em;
  }
</style>