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
		class="grid grid-cols-5 gap-1 text-center mb-1 [&_label]:leading-6 [&>label]:col-span-2 [&>input]:col-span-3 [&_input]:h-6 [&_input]:mt-0"
	>
		<label for="title">Title</label>
		<input type="text" name="title" bind:value={data.title} />

		<label for="description">Description</label>
		<input type="text" name="description" bind:value={data.description} placeholder="Archive Description" />

		<label for="location">File Location</label>
		<input disabled type="text" name="location" bind:value={data.location} />
	</div>
	<div>
		<!-- svelte-ignore missing-declaration -->
		<button on:click={resolve}> Save </button>
	</div>
</div>
