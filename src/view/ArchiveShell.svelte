<svelte:options accessors={true} />

<script>
	import { ApplicationShell } from "#runtime/svelte/component/core";
	import { settings } from "$lib/settings.js";
	import { i } from "$lib/utils.js";
	/* const { application } = getContext("#external"); */

	export let elementRoot;

	const archives = settings.getStore("archives");

	function createArchive() {
		archives.update((value) => {
			value.push({
				id: foundry.utils.randomID(),
				title: "New Archive; " + Math.random().toString(36).substr(2, 5),
				timestamp: Date.now(),
				description: "New archive description",
				location: "",
			});
			return value;
		});
	}

	function addArchive() {
		ui.notifications.info("addArchive");
	}

	function removeArchive() {
		// TODO: Confirm dialog
		archives.update((value) => {
			const index = value.findIndex((archive) => archive.id === selectedArchive.id);
			value.splice(index, 1);

			selectedArchive = null;
			return value;
		});
	}

	let selectedArchive = null;
</script>

<ApplicationShell bind:elementRoot>
	<main class="max-h-full h-full flex flex-row gap-0.5">
		<div class="w-[350px] foundry-border flex flex-col" class:muted={$archives.length === 0}>
			<!-- Archive List -->
			<div class="h-full p-1 gap-1 flex flex-col overflow-y-scroll overflow-x-hidden">
				{#if $archives.length === 0}
					<i class="h-full align-center flex items-center justify-center"> {i("noArchive.found")} </i>
				{/if}
				{#each $archives as archive}
					<button
						class="relative min-h-16"
						on:click={() => (selectedArchive = archive)}
						class:active={selectedArchive === archive}
					>
						<span>{archive.title}</span>
						<span class="text-xs absolute right-1 bottom-0">
							{new Date(archive.timestamp).toDateString()}
						</span>
					</button>
				{/each}
			</div>
			<!-- svelte-ignore missing-declaration -->
			{#if game.user.isGM}
				<!-- Buttons -->
				<div class="flex flex-row p-0.5">
					<button class="" on:click={createArchive}>{i("create")}</button>
					<button class="w-8 [&>i]:m-0.5" data-tooltip={i("add")} on:click={addArchive}>
						<i class="fa fa-file-import" />
					</button>
					<button
						class="w-8 [&>i]:m-0.5"
						data-tooltip={i("remove")}
						on:click={removeArchive}
						disabled={!selectedArchive}
					>
						<i class="fa fa-trash" />
					</button>
				</div>
			{/if}
		</div>
		<div class="w-full">
			{#if selectedArchive}
				<div>{JSON.stringify(selectedArchive)}</div>
			{:else}
				<i class="h-full align-center muted foundry-border flex items-center justify-center">
					{i("noArchive.selected")}
				</i>
			{/if}
		</div>
	</main>
</ApplicationShell>

<style lang="postcss">
	.foundry-border {
		@apply border-2 rounded-sm;
		border: 1px solid var(--color-border-light-primary);
	}

	.muted {
		background-color: rgba(128, 128, 128, 0.25);
	}

	.active {
		background-color: rgba(0, 225, 255, 0.25);
	}
</style>
