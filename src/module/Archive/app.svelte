<script lang="ts">
	import { archiveMessages, type Data } from "$lib/utils";
	import { settings } from "../settings.svelte";

	let title = $state("");
	let selected: Data | undefined = $state();

	async function submit() {
		await archiveMessages(
			{ title },
			game.messages.contents as unknown as ChatMessage["_source"][],
			{}
		);
	}

	async function open(jsonFile: Data) {
		const res = await fetch(jsonFile.location);
		const vaData = await res.json();
		console.log(vaData)
		const chatLog = new window.vauxsArchives!.VAChatLog!({
			vaData: {
				messages: vaData.messages,
				...vaData.data
			}
		});
		chatLog.renderPopout();
	}
</script>

<main>
	<aside>
		<header>{settings.archives.length} Archives</header>

		{#each settings.archives as archive}
			<button
				class="archive-btn"
				class:active={selected?.id === archive.id}
				onclick={() => (selected = archive)}
			>
				<span class="title">{archive.title}</span>
				<span class="location">{archive.location}</span>
			</button>
		{/each}

		<footer>
			<label for="varch-title">Make a new archive</label>
			<input id="varch-title" type="text" bind:value={title} placeholder="Archive title…" />
			<button onclick={submit}>Create</button>
		</footer>
	</aside>

	<article>
		{#if selected}
			<h1>{selected.title}</h1>
			<p class="meta">
				{new Date(selected.timestamp).toLocaleString()} · {selected.location}
			</p>
			<p class="description">{selected.description}</p>
			<button class="open-btn" onclick={() => open(selected!)}>Open Archive</button>
		{:else}
			<p class="placeholder">Select an archive to view details</p>
		{/if}
	</article>
</main>

<style lang="scss">
	:root {
		--bg: hsl(220 20% 10%);
		--surface: hsl(220 20% 15% / 0.4);
		--surface-hover: hsl(220 20% 20% / 0.6);
		--accent: hsl(200 80% 60%);
		--text: hsl(220 20% 90%);
		--text-muted: hsl(220 20% 60%);
	}

	main {
		display: flex;
		height: 100%;
		background: radial-gradient(circle at 50% 0%, var(--surface), transparent 70%);
	}

	aside {
		flex: 0 0 33.333%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		background: linear-gradient(
			135deg,
			var(--surface),
			hsl(220 20% 12% / 0.3) 60%
		);
		backdrop-filter: blur(4px);
	}

	header {
		font-weight: 600;
		color: var(--text);
	}

	.archive-btn {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.125rem;

		height: 3rem;          /* fixed height */
		min-height: 3rem;      /* prevent shrinking */
		padding: 0.5rem 0.75rem;

		border: none;
		border-radius: 0.5rem;
		background: transparent;
		color: var(--text);
		cursor: pointer;
		transition: background 0.2s;

		line-height: 1.1;      /* tighter vertical rhythm */

		&:hover {
			background: var(--surface-hover);
		}

		&.active {
			background: linear-gradient(
			90deg,
			var(--accent) / 0.2,
			transparent 80%
			);
		}

		.title {
			font-weight: 500;
			font-size: 0.875rem;
		}

		.location {
			text-align: left;
			font-size: 0.6rem;
			color: var(--text-muted);
		}
	}

	footer {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		label {
			font-size: 0.875rem;
			color: var(--text-muted);
		}

		input {
			padding: 0.5rem;
			border: 1px solid var(--surface-hover);
			border-radius: 0.375rem;
			background: var(--surface);
			color: var(--text);
		}

		button {
			padding: 0.5rem;
			border: none;
			border-radius: 0.375rem;
			background: var(--accent);
			color: var(--bg);
			cursor: pointer;
		}
	}

	article {
		flex: 1;
		padding: 2rem;
		overflow-y: auto;
	}

	h1 {
		margin: 0 0 0.5rem;
		font-size: 1.5rem;
		color: var(--text);
	}

	.meta {
		margin: 0 0 1rem;
		color: var(--text-muted);
	}

	.description {
		line-height: 1.6;
		color: var(--text);
	}

	.placeholder {
		color: var(--text-muted);
		font-style: italic;
	}

	.open-btn {
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.375rem;
		background: var(--accent);
		color: var(--bg);
		cursor: pointer;
	}
</style>