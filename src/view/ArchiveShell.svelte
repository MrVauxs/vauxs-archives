<svelte:options accessors={true} />

<script>
	import { ApplicationShell } from "#runtime/svelte/component/core";
	import { TJSTinyMCE } from "#standard/component";
	import { mId, archives } from "$lib/settings.js";
	import { i, getJSON, dev } from "$lib/utils.js";
	import { getContext } from "svelte";
	import { TJSDialog } from "#runtime/svelte/application";
	import ArchiveEditor from "./ArchiveEditor.svelte";
	import { dataObj, createArchive } from "./createArchive.js";
	import { derived, writable } from "svelte/store";

	const VArchChatLogClass = game.modules.get("vauxs-archives").api.VArchChatLogClass;
	const { application } = getContext("#external");

	export let elementRoot;

	const storeTitle = application.reactive.storeAppOptions.title;
	const loadLastArchive = game.modules.get(mId).api.loadLastArchiveStore;

	async function addArchive() {
		const fp = new FilePicker({
			current: `worlds/${game.world.id}`,
			type: "text",
			callback: async (location) => {
				const response = await getJSON(location);

				if (!!response)
					TJSDialog.wait({
						title: i("modal.create.title"),
						zIndex: 1000,
						content: {
							class: ArchiveEditor,
							props: {
								data: dataObj({
									timestamp: new Date(response.lastModified).getTime(),
									title: response.json?.name,
									description:
										response.json?.description ?? Array.isArray(response.json)
											? "From DF Chat Enhancements"
											: "",
									id: response.json?.id,
									...response.json?.data,
									location,
								}),
							},
						},
					});
			},
		});

		fp.browse();
	}

	async function removeArchive() {
		if (!selectedArchive) {
			ui.notifications.error("No archive is selected!");
			return;
		}

		/**
		 * @type {boolean|null} result
		 */
		const result = await TJSDialog.confirm({
			title: i("modal.remove.title"),
			headerIcon: "modules/vauxs-archives/assets/Warn16px.png",
			draggable: false,
			minimizable: false,
			modal: true,
			closeOnInput: true,
			content: i("modal.remove.content", { title: selectedArchive.title }),
		});

		if (result) {
			archives.update((value) => {
				value.delete(selectedArchive.id);
				selectedArchive = null;
				return value;
			});
		}
	}

	async function popOut(messages) {
		if (typeof messages === "string") {
			const { json } = await getJSON(messages);
			messages = json.messages || json;
		}
		new VArchChatLogClass({}, messages).renderPopout();
	}

	$: if (selectedArchive) storeTitle.set(i("title") + " - " + selectedArchive.title);

	let sortType = writable(2); // 0 = default, 1 = time ascending, 2 = time descending, 3 = title ascending, 4 = title descending

	function sortedDisplay() {
		return new Map(
			[...$archives].sort((a, b) => {
				if ($sortType === 1) return a[1].timestamp - b[1].timestamp;
				if ($sortType === 2) return b[1].timestamp - a[1].timestamp;
				if ($sortType === 3) return a[1].title.localeCompare(b[1].title);
				if ($sortType === 4) return b[1].title.localeCompare(a[1].title);
				return 0;
			}),
		);
	}

	let display = derived([archives, sortType], () => sortedDisplay());

	let selectedArchive = $loadLastArchive ? $display.values().next().value : null;

	function updateArchives(data) {
		if (!data.id) {
			ui.notifications.error("Edited archive has no ID! What?? Let Vauxs know.");
			console.error(data);
			return;
		}
		archives.update((value) => {
			value.set(data.id, data);
			return value;
		});
	}
</script>

<ApplicationShell bind:elementRoot>
	<main class="max-h-full h-full flex flex-row gap-0.5">
		<div class="w-1/2 foundry-border flex flex-col relative" class:muted={$archives.size === 0}>
			<button
				class="absolute top-0.5 left-0.5 z-10 size-8 bg-slate-200"
				on:click={() => {
					$sortType++;
					$sortType > 4 ? ($sortType = 0) : null;
				}}
				on:contextmenu={() => {
					$sortType--;
					$sortType < 0 ? ($sortType = 4) : null;
				}}
				data-tooltip={"Sort by Date/Title" +
					($sortType === 0 ? "" : $sortType === 1 || $sortType === 2 ? " (Date)" : " (Title)")}
			>
				{#if $sortType === 1}
					<i class="fas fa-arrow-down-wide-short mx-auto leading-7" />
				{:else if $sortType === 2}
					<i class="fas fa-arrow-up-wide-short mx-auto leading-7" />
				{:else if $sortType === 3}
					<i class="fas fa-arrow-down-a-z mx-auto leading-7" />
				{:else if $sortType === 4}
					<i class="fas fa-arrow-up-a-z mx-auto leading-7" />
				{:else}
					<i class="fas fa-sort mx-auto leading-7" />
				{/if}
			</button>
			<!-- Archive List -->
			<div class="h-full p-1 gap-1 flex flex-col overflow-y-scroll overflow-x-hidden">
				{#if $display.size === 0}
					<i class="h-full align-center flex items-center justify-center"> {i("noArchive.found")} </i>
				{/if}
				{#each $display as [id, archive]}
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
		<div class="w-1/2">
			{#if selectedArchive}
				<!-- Inline debug hack without using {@debug}, basically -->
				{(dev ? console.log(selectedArchive) : "") || ""}
				{#await getJSON(selectedArchive.location)}
					<div class="h-full align-center flex items-center justify-center">
						<i class="fa fa-spinner fa-spin" />
					</div>
				{:then response}
					<div class="h-full flex flex-col gap-1 overflow-hidden overflow-y-auto">
						<div class="flex flex-col gap-4">
							<input
								class="text-lg [&:not(:hover)]:border-none [&:not(:hover)]:bg-transparent text-center"
								type="text"
								value={selectedArchive.title}
								on:change={(event) => updateArchives({ ...selectedArchive, title: event.target.value })}
							/>
							<div
								class="border border-solid border-slate-500 bg-slate-300/50 min-h-48 max-h-80 rounded-md relative pl-1"
							>
								<div class="absolute -top-4 left-0 text-xs opacity-25">Description</div>
								<TJSTinyMCE
									content={selectedArchive.description}
									on:editor:save={(event) =>
										updateArchives({ ...selectedArchive, description: event.detail.content })}
								/>
							</div>
						</div>
						<div class="varch-code p-0.5 text-xs text-center">
							{selectedArchive.location}
						</div>
						<button on:click={() => popOut(response.json.messages || response.json)}>{i("open")}</button>

						<!--
							Replaced in favor of having a dedicated popout button
						{#each response.json.messages || response.json as message}
							{(dev ? (window.vcemessages = response.json.messages) : "") && ""}
							<!-- svelte-ignore missing-declaration --\>
							{#await new ChatMessage(message).getHTML() then htmlArray}
								{#each htmlArray as htmlMessage}
									{@html htmlMessage.outerHTML}
								{/each}
							{/await}
						{/each}
					-->
					</div>
				{:catch error}
					<pre>{error}</pre>
				{/await}
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
