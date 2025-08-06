<script lang="ts">
	import { archiveMessages, todayYYMMDD, type Data } from "$lib/utils";
	import { settings } from "../settings.svelte";

	let title = $state("");
	let selected: Data | undefined = $state();

	async function submit() {
		await archiveMessages(
			{ title: title.trim() || `Archive ${todayYYMMDD()}` },
			game.messages.contents as unknown as ChatMessage["_source"][],
			{}
		);
	}

	async function open(jsonFile: Data) {
		const res = await fetch(jsonFile.location);
		const vaData = await res.json();
		const chatLog = new window.vauxsArchives!.VAChatLog!({ vaData });
		chatLog.renderPopout();
	}

	async function onDelete(ev: MouseEvent, archive: Data) {
		ev.stopPropagation();
		const confirmed = await foundry.applications.api.DialogV2.confirm({
			window: { title: "Confirm Archive Deletion" },
			content: `
				<p style="text-align: center">Are you sure you want to delete <b>"${archive.title}"</b>?</p>
				<p style="font-size:0.75rem">Please note this will not delete the archives from the file system, so this only hides the entry in your Foundry world.</p>
			`
		})
		if (!confirmed) return;

		const archives = game.settings.get('vauxs-archives', 'archives') as Data[];
		game.settings.set('vauxs-archives', 'archives', archives.filter(x => x.id !== archive.id))
	}
</script>

<main>
	<aside>
		<header style="text-align:center;">{settings.archives.length} Archives</header>
		<hr style="margin:0"/>
		<div class="list">
			{#each settings.archives as archive}
				<div class="archive-row">
					<button
						class="archive-btn"
						class:active={selected?.id === archive.id}
						onclick={() => (selected = archive)}
					>
						<span class="title">{archive.title}</span>
						<span class="location">{archive.location}</span>
					</button>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<i
						role="button"
						tabindex="0"
						class="fas fa-trash-alt delete-icon"
						onclick={(ev) => onDelete(ev, archive)}
						title="Delete archive"
					></i>
				</div>
			{/each}
		</div>

		<footer>
			<label for="varch-title">Make a new archive</label>
			<input id="varch-title" type="text" bind:value={title} placeholder={`Archive ${todayYYMMDD()}`} />
			<button onclick={submit}>Create</button>
		</footer>
	</aside>

	<article>
		{#if selected}
			<h1>{selected.title}</h1>
			<p class="meta">
				{new Date(selected.timestamp).toLocaleString()}
				<br>
				{selected.location}
			</p>
			<p class="description">{selected.description}</p>
			<button class="open-btn" onclick={() => open(selected!)}>Open Archive</button>
		{:else}
			<p class="placeholder">Select an archive to view details</p>
		{/if}
	</article>
</main>

<style lang="scss">
	:global(.theme-dark) :global(.vauxs-archives) {
		--bg: hsl(220 20% 10%);
		--surface: hsla(219, 14%, 28%, 0.4);
		--surface-hover: hsl(220 20% 20% / 0.6);
		--accent: hsl(200 80% 60%);
		--text: hsl(220 20% 90%);
		--text-muted: hsl(220 20% 60%);
	}
	:global(.theme-light) :global(.vauxs-archives) {
		--bg: hsl(220 20% 10%);
		--surface: hsl(220 20% 15% / 0.2);
		--surface-hover: hsl(220 50% 50% / 0.6);
		--accent: hsl(200 50% 50%);
		--text: hsl(220 20% 90%);
		--text-muted: hsl(220 20% 20%);
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
		min-height: 0; /* enables flex-shrink for children */
	}

	.list {
		flex: 1 1 auto;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	header {
		font-weight: 600;
		color: var(--text);
	}

	.archive-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.archive-btn {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		justify-content: center;
		gap: 0.125rem;
		height: 3rem;
		min-height: 3rem;
		padding: 0.5rem 0.75rem;
		border: none;
		border-radius: 0.5rem;
		background: transparent;
		color: var(--text);
		cursor: pointer;
		transition: background 0.2s;
		line-height: 1.1;

		outline: none;
		box-shadow: none;

		&:hover {
			background: var(--surface-hover);
		}

		&.active {
			outline: none;
			box-shadow: none;
			background: linear-gradient(
				120deg,
				hsla(200, 80%, 60%, 0.2),
				hsla(100, 80%, 60%, 0.1),
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

		.delete-icon {
			z-index: 10;
			position: absolute;
			top: 0.5rem;
			right: 0.5rem;
			font-size: 0.75rem;
			color: var(--text-muted);
			cursor: pointer;
			transition: color 0.2s;

			&:hover {
				color: hsl(0 80% 60%);
			}
		}
	}

	.delete-icon {
		cursor: pointer;
		font-size: 0.75rem;
		color: var(--text-muted);
		transition: color 0.2s;

		&:hover {
			color: hsl(0 80% 60%);
		}
	}

	footer {
		flex: 0 0 auto; /* never shrink */
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 0.5rem;
	}

	label {
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	input {
		padding: 0.5rem;
		border: 1px solid var(--surface-hover);
		border-radius: 0.375rem;
		background: var(--surface);
	}

	button {
		padding: 0.5rem;
		border: none;
		border-radius: 0.375rem;
		background: var(--accent);
		color: var(--bg);
		cursor: pointer;
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
		text-align: center;
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