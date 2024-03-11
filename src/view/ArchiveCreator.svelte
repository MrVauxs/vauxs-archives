<svelte:options accessors={true} />

<script>
	import { getContext } from "svelte";
	export let data;
	const promise = getContext("#managedPromise");
	const { application } = getContext("#external");

	function resolve() {
		promise.resolve(data);
		application.close();
	}

	function archiveMessages() {
		// ChatMessage.deleteDocuments(messageIDs);
	}

	let deleteMessages = false;
	let archiveAll = false;
	let messageIDs = game.messages.map((message) => message.id);

	let from = new Date(game.messages.contents.at(0).timestamp).toISOString().slice(0, 16);
	let to = new Date(game.messages.contents.at(-1).timestamp).toISOString().slice(0, 16);

	$: if (archiveAll) messageIDs = game.messages.map((message) => message.id);
	$: if (!archiveAll) {
		messageIDs = game.messages
			.filter((message) => {
				return message.timestamp >= new Date(from).getTime() && message.timestamp <= new Date(to).getTime();
			})
			.map((message) => message.id);
	}
</script>

<div id="vauxs-tw">
	<div
		class="grid grid-cols-5 gap-1 text-center mb-1 [&_label]:leading-6 [&>label]:col-span-2 [&>input]:col-span-3 [&_input]:h-6 [&_input]:mt-0"
	>
		<label for="title">Title</label>
		<input type="text" name="title" bind:value={data.title} />

		<label for="description">Description</label>
		<input type="text" name="description" bind:value={data.description} placeholder="Archive Description" />

		<label for="location">File Location</label>
		<input disabled type="text" name="location" bind:value={data.location} />

		<div class="col-span-5 text-center">
			<label class="align-top" for="all">Archive all messages</label>
			<input type="checkbox" name="all" bind:checked={archiveAll} />
		</div>

		{#if !archiveAll}
			<div class="col-span-5 flex-1 row-span-2 grid grid-cols-2 gap-2">
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

		<div class="col-span-5 text-center">
			<label class="align-top" for="deleteMessages">Delete Messages</label>
			<!-- svelte-ignore missing-declaration -->
			{#if game.modules.get("foundrytodiscord")?.active}
				<i
					class="fa fa-info-circle align-top leading-6 underline-offset-2 underline"
					data-tooltip="You have <u>Foundry to Discord</u> enabled. Please note that the module ignores mass deletions (10+ messages), meaning that your Discord copies will not be removed."
					data-tooltip-direction="UP"
				/>
			{/if}
			<input type="checkbox" name="deleteMessages" bind:value={deleteMessages} />
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
		<button on:click={resolve} disabled={!messageIDs.length}>Archive {messageIDs.length} Messages</button>
	</div>
</div>
