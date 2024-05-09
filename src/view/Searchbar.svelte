<script>
	export let app;
	let messages = app.messagesStore;
	let originalMessages = app._original.messages;

	let string = "";
	let caseSensitive = false;
	let includeAlias = true;

	let newMessages = originalMessages;

	$: newMessages = originalMessages.filter((message) => {
		// Check for contents
		const messageContents = caseSensitive ? message.content : message.content.toLowerCase();
		const findMessageByContent = messageContents.includes(caseSensitive ? string : string.toLowerCase());
		// Check for names
		const messageAlias = message.alias.toLowerCase();
		const findMessageByAlias = includeAlias ? messageAlias.includes(string.toLowerCase()) : false;

		return findMessageByContent || findMessageByAlias;
	});

	$: if (newMessages.length !== $messages.length) messages.set(newMessages);

	function exportChatLog() {
		const log = originalMessages.map((m) => m.export()).join("\n---------------------------\n");
		let date = new Date().toDateString().replace(/\s/g, "-");
		const filename = `fvtt-log-${date}.txt`;
		saveDataToFile(log, "text/plain", filename);
	}
</script>

<div class="vauxs-archive">
	<div class="mx-1 mb-0.5">
		<div class="flex flex-row gap-0.5 text-xs mr-0.5 mb-0.5">
			<button
				class="shadow-black"
				class:shadow-inner={caseSensitive}
				on:click={() => (caseSensitive = !caseSensitive)}
				data-tooltip="Case Sensitive"
				data-tooltip-direction="UP"
			>
				<i class="fa-solid fa-font-case m-0" />
			</button>
			<button
				class="shadow-black"
				class:shadow-inner={includeAlias}
				on:click={() => (includeAlias = !includeAlias)}
				data-tooltip="Search Usernames"
				data-tooltip-direction="UP"
			>
				<i class="fa-solid fa-user m-0" />
			</button>
			<button disabled data-tooltip="To Be Added; Request any additions here!" data-tooltip-direction="UP">
				<i class="fa-solid fa-transporter-empty m-0"></i>
			</button>
			<button on:click={() => exportChatLog()} data-tooltip="Export as .txt" data-tooltip-direction="UP">
				<i class="fa-solid fa-file-export m-0" />
			</button>
		</div>
		<input class="h-10" type="text" bind:value={string} placeholder="Search..." />
	</div>
</div>

<style lang="postcss">
	.vauxs-archive {
		flex: 0;

		& input {
			color: var(--color-text-dark-primary);
			background: url(../ui/parchment.jpg) repeat;
		}
	}
</style>
