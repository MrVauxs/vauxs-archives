<script lang="ts">
	import { archiveMessages } from "$lib/utils";
	import { settings } from "../settings.svelte";

	let title = $state("")
	let selected = $state()

	async function submit() {
		/* const { status, path } =  */
		await archiveMessages({ title }, game.messages.contents as unknown as ChatMessage["_source"][], {})
	}
</script>

<main>
	<aside>
		<header>{settings.archives.length} Archives</header>
		{#each settings.archives as archive}
			<button
				onclick={() => selected = archive}
			>
				{archive.title} - {archive.location}
			</button>
		{/each}
		<footer>
			Make new archive
			<input type="text" bind:value={title} />
			<button onclick={submit}>Create</button>
		</footer>
	</aside>

	<article>
		{#if selected}
			{JSON.stringify(selected)}
		{:else}
			No Archive Selected
		{/if}
	</article>
</main>

<style lang="scss">
	main {
		max-height: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		gap: 0.125rem;
	}

	aside {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	article {
		user-select: text;
	}
</style>