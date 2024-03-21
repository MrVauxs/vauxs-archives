<svelte:options accessors={true} />

<script>
	import { ApplicationShell } from "#runtime/svelte/component/core";
	import { mId, archives } from "$lib/settings.js";
	import { i, validateObject, getJSON, dev } from "$lib/utils.js";
	import { getContext } from "svelte";
	import { TJSDialog } from "#runtime/svelte/application";
	import ArchiveCreator from "./ArchiveCreator.svelte";
	import ArchiveEditor from "./ArchiveEditor.svelte";
	import VCEChatLog from "./ChatLog.js";
	const { application } = getContext("#external");

	export let elementRoot;

	const storeTitle = application.reactive.storeAppOptions.title;
	const loadLastArchive = game.modules.get(mId).api.loadLastArchiveStore;

	function dataObj(input = {}) {
		Object.keys(input).forEach((key) => input[key] === undefined && delete input[key]); // Remove undefined keys

		const id = foundry.utils.randomID();
		const data = foundry.utils.mergeObject(
			{
				id,
				title: `Archive ${id.slice(0, 4)}; ${new Date(Date.now()).toDateString()}`,
				timestamp: Date.now(),
				description: "",
				location: `worlds/${game.world.id}/chat-archives/${id}.json`,
			},
			input,
		);
		return data;
	}

	async function createArchive(event, input) {
		const data = dataObj(input);

		if (!game.messages.size) return ui.notifications.error("No messages found!");

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
				return value.set(result.id, result);
			});
		}
	}

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
		new VCEChatLog({}, messages).renderPopout();
	}

	let selectedArchive = $loadLastArchive ? $archives.values().next().value : null;

	$: if (selectedArchive) storeTitle.set(i("title") + " - " + selectedArchive.title);
</script>

<ApplicationShell bind:elementRoot>
	<main class="max-h-full h-full flex flex-row gap-0.5">
		<div class="w-1/2 foundry-border flex flex-col" class:muted={$archives.size === 0}>
			<!-- Archive List -->
			<div class="h-full p-1 gap-1 flex flex-col overflow-y-scroll overflow-x-hidden">
				{#if $archives.size === 0}
					<i class="h-full align-center flex items-center justify-center"> {i("noArchive.found")} </i>
				{/if}
				{#each $archives as [id, archive]}
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
					<div class="h-full flex flex-col gap-2">
						<div class="flex flex-col gap-2 text-center">
							<div class="text-lg">"{selectedArchive.title}"</div>
							<div
								class="italic border border-solid border-slate-500 bg-slate-300/50 min-h-8 p-4 rounded-md relative"
							>
								<div class="absolute left-0.5 top-0.5 text-xs opacity-25">Description</div>
								{selectedArchive.description}
							</div>
						</div>
						<button on:click={() => popOut(response.json.messages || response.json)}>{i("open")}</button>

						<div disabled class="w-[80%] mx-auto p-2 rounded-md bg-slate-500 text-white text-center">
							TODO: Add more buttons, summaries, etc.!
						</div>
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
