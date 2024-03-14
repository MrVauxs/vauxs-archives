<svelte:options accessors={true} />

<script>
	import { ApplicationShell } from "#runtime/svelte/component/core";
	import { settings } from "$lib/settings.js";
	import { i, validateObject } from "$lib/utils.js";
	import { getContext } from "svelte";
	import { TJSDialog } from "#runtime/svelte/application";
	import ArchiveCreator from "./ArchiveCreator.svelte";
	const { application } = getContext("#external");

	export let elementRoot;

	const archives = settings.getStore("archives");
	const storeTitle = application.reactive.storeAppOptions.title;

	async function createArchive(event, input) {
		const id = foundry.utils.randomID();
		const data = foundry.utils.mergeObject(
			{
				id,
				title: "New Archive; " + new Date(Date.now()).toDateString(),
				timestamp: Date.now(),
				description: "",
				location: `worlds/${game.world.id}/chat-archive/${id}.json`,
			},
			input,
		);

		const result = await TJSDialog.wait({
			// modal: true,
			title: i("modal.create.title"),
			zIndex: 1000,
			content: { class: ArchiveCreator, props: { data, event } },
		});

		const validated = validateObject(
			{
				id: "string",
				title: "string",
				timestamp: "number",
				description: "string",
				location: "string",
			},
			result,
		);

		if (validated) {
			archives.update((value) => {
				return [...value, result];
			});
		}
	}

	async function addArchive() {
		const fp = new FilePicker({ current: `worlds/${game.world.id}`, callback: (result) => console.log(result) });
		await fp.browse();
	}

	async function removeArchive() {
		if (!selectedArchive) {
			ui.notifications.error("No archive is selected!");
			return;
		}

		/**
		 * @type {boolean|null}
		 */
		const result = await TJSDialog.confirm({
			title: i("modal.remove.title"),
			headerIcon: "modules/vauxs-archival/assets/Warn16px.png",
			draggable: false,
			minimizable: false,
			modal: true,
			closeOnInput: true,
			content: i("modal.remove.content", { title: selectedArchive.title }),
		});

		if (result) {
			archives.update((value) => {
				value = value.filter((archive) => archive.id !== selectedArchive.id);

				selectedArchive = null;
				return value;
			});
		}
	}

	let selectedArchive = null;

	$: if (selectedArchive) storeTitle.set(i("title") + " - " + selectedArchive.title);
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
	.muted {
		background-color: rgba(128, 128, 128, 0.25);
	}

	.active {
		border: 1px solid var(--color-border-highlight-alt);
		box-shadow: 0 0 5px inset var(--color-shadow-highlight);
	}
</style>
