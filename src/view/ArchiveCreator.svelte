<svelte:options accessors={true} />

<script>
	export let data;
	import { getContext } from "svelte";
	const promise = getContext("#managedPromise");
	const { application } = getContext("#external");

	async function resolve() {
		const { status, path } = await archiveMessages(data);
		if (status === "success") {
			promise.resolve({ ...data, location: path });
			application.close();
		} else {
			ui.notifications.error("Failed to archive messages. See console log for details.");
			throw Error(`"Failed to archive messages. ${JSON.stringify(data)}`);
		}
	}

	async function archiveMessages() {
		ui.notifications.info("Archiving messages...");

		const json = JSON.stringify({ data, messages }, null, "\t");
		const file = new File([json], `${data.id}.json`, { type: "application/json" });
		const folderPath = data.location.split("/").slice(0, -1).join("/");
		const worldPath = folderPath.split("/").slice(0, -1).join("/");

		// Check if chat-archives folder exists, create if not.
		await foundry.applications.apps.FilePicker.implementation.browse("data", worldPath).then(async (result) => {
			if (!result.dirs.includes(folderPath)) {
				await foundry.applications.apps.FilePicker.implementation.createDirectory("data", folderPath);
			}
		});

		const response = await foundry.applications.apps.FilePicker.implementation.upload("data", folderPath, file);

		if (response && response.status === "success" && deleteMessages) {
			game.messages.documentClass.deleteDocuments(
				messages.map((message) => message.id),
				{ deleteAll: archiveAll },
			);
		}

		return response;
	}

	let deleteMessages = false;
	let archiveAll = false;
	let messages = game.messages.contents;

	let from = new Date(game.messages.contents.at(0).timestamp).toISOString().slice(0, 16);
	let to = new Date(game.messages.contents.at(-1).timestamp).toISOString().slice(0, 16);

	$: if (archiveAll) messages = game.messages.contents;
	$: if (!archiveAll) {
		messages = game.messages.contents.filter((message) => {
			return message.timestamp >= new Date(from).getTime() && message.timestamp <= new Date(to).getTime();
		});
	}
</script>

<div class="vauxs-archive">
	<div class="grid grid-cols-2 gap-1 text-center mb-1 [&_label]:leading-6 [&_input]:h-6 [&_input]:mt-0">
		<label class="contents">
			Title
			<input type="text" bind:value={data.title} />
		</label>

		<label class="contents">
			Description
			<input type="text" bind:value={data.description} placeholder="Archive Description" />
		</label>

		<label class="contents">
			File location
			<input disabled type="text" bind:value={data.location} />
		</label>

		<div class="contents">
			Archive all Messages
			<input type="checkbox" class="mx-auto" bind:checked={archiveAll} />
		</div>

		{#if !archiveAll}
			<div class="col-span-2 flex-1 row-span-2 grid grid-cols-2 gap-2">
				<span class="relative">
					<label for="date-from">From</label>
					<!-- svelte-ignore missing-declaration -->
					<button
						class="fa fa-undo size-6 leading-4 pr-5 absolute right-0"
						on:click={() => {
							from = new Date(game.messages.contents.at(0).timestamp).toISOString().slice(0, 16);
						}}
					/>
				</span>
				<input type="datetime-local" bind:value={from} id="date-from" />
				<span class="relative">
					<label for="date-to">To</label>
					<!-- svelte-ignore missing-declaration -->
					<button
						class="fa fa-undo size-6 leading-4 pr-5 absolute right-0"
						on:click={() => {
							to = new Date(game.messages.contents.at(-1).timestamp).toISOString().slice(0, 16);
						}}
					/>
				</span>
				<input type="datetime-local" bind:value={to} id="date-to" />
			</div>
		{/if}

		<div class="contents" for="deleteMessages">
			<span>
				Delete Messages
				<!-- svelte-ignore missing-declaration -->
				{#if game.modules.get("foundrytodiscord")?.active}
					<i
						class="fa fa-info-circle align-top leading-6 underline-offset-2 underline ml-0.5"
						data-tooltip="You have <u>Foundry to Discord</u> enabled. Please note that the module ignores mass deletions (10+ messages), meaning that your Discord copies will not be removed."
						data-tooltip-direction="UP"
					/>
				{/if}
			</span>
			<input type="checkbox" class="mx-auto" bind:checked={deleteMessages} />
		</div>
		<!--
				Due to how Discord APIs work, mass-deleting messages is not a thing anyway.
				https://github.com/therealguy90/foundrytodiscord/issues/30
			{#if game.modules.get("foundrytodiscord")?.active}
				<label for="discord">Delete on Discord</label>
				<input type="checkbox" name="discord" bind:value={deleteOnDiscord} />
			{/if}
			-->
	</div>
	<div>
		<!-- svelte-ignore missing-declaration -->
		<button on:click={resolve} disabled={!messages.length}>
			Archive {deleteMessages ? "and delete" : ""}
			{messages.length} / {game.messages.size} Messages
		</button>
	</div>
</div>
