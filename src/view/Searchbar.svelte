<script>
	export let app;
	let messages = app.messagesStore;
	let originalMessages = app.originalMessages;

	let string = "";
	let caseSensitive = false;

	$: messages.update(() => {
		return originalMessages.filter((message) => {
			const messagecontents = caseSensitive ? message.content : message.content.toLowerCase();
			return messagecontents.includes(caseSensitive ? string : string.toLowerCase());
		});
	});
</script>

<div id="vauxs-archive">
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
			<button disabled data-tooltip="To Be Added; Request any additions here!" data-tooltip-direction="UP">
				<i class="fa-solid fa-transporter-empty m-0"></i>
			</button>
			<button disabled data-tooltip="To Be Added; Request any additions here!" data-tooltip-direction="UP">
				<i class="fa-solid fa-transporter-empty m-0"></i>
			</button>
			<button disabled data-tooltip="To Be Added; Request any additions here!" data-tooltip-direction="UP">
				<i class="fa-solid fa-transporter-empty m-0"></i>
			</button>
		</div>
		<input class="h-10" type="text" bind:value={string} placeholder="Search..." />
	</div>
</div>

<style lang="postcss">
	#vauxs-archive {
		flex: 0;

		& input {
			color: var(--color-text-dark-primary);
			background: url(../ui/parchment.jpg) repeat;
		}
	}
</style>
