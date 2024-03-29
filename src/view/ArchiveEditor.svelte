<script>
	export let data;
	import { validateObject } from "$lib/utils.js";
	import { archives } from "$lib/settings.js";
	import { getContext } from "svelte";
	const promise = getContext("#managedPromise");
	const { application } = getContext("#external");

	async function resolve() {
		const validated = validateObject(
			{
				id: "string",
				title: "string",
				timestamp: "number",
				description: "string",
				location: "string",
			},
			data,
		);

		if (validated) {
			archives.update((value) => {
				value.set(data.id, data);
				return value;
			});
		}

		promise.resolve(data);
		application.close();
	}
</script>

<div id="vauxs-archive">
	<div
		class="grid grid-cols-2 gap-1 text-center mb-1 [&_label]:leading-6 [&>label]:col-span-2 [&>input]:col-span-3 [&_input]:h-6 [&_input]:mt-0"
	>
		<label class="contents">
			Title
			<input type="text" bind:value={data.title} />
		</label>

		<label class="contents">
			Description
			<input type="text" bind:value={data.description} placeholder="Archive Description" />
		</label>

		<label class="contents">
			File Location
			<input disabled type="text" bind:value={data.location} />
		</label>
	</div>
	<div>
		<!-- svelte-ignore missing-declaration -->
		<button on:click={resolve}> Save </button>
	</div>
</div>
