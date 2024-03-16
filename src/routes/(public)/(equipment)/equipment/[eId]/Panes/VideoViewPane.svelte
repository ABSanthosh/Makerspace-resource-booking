<script lang="ts">
	import Pane from '$components/Pane.svelte';
	import YtEmbed from '$components/YtEmbed.svelte';
	import type { ESchema } from '$lib/schemas';
	import type { Video } from '@prisma/client';

	export let { currentEquipment, modal } = $$props as {
		modal: boolean;
		currentEquipment: (ESchema & { videos: Video[] }) | null;
	};

	$: eVideos = currentEquipment?.videos!;
</script>

<Pane bind:open={modal} style="--paneWidth: 450px;" on:close={() => (modal = false)}>
	<p slot="header">Videos: {currentEquipment?.name}</p>
	<svelte:fragment slot="main">
		<table class="FancyTable">
			<thead>
				<tr>
					<th style="width: 100%;"> Name </th>
				</tr>
			</thead>
			<tbody>
				{#if eVideos.length === 0}
					<tr>
						<td colspan="2">
							<i> No Videos found </i>
						</td>
					</tr>
				{/if}
				{#each eVideos as item}
					<tr>
						<td colspan="2">
							<YtEmbed url={item.video} />
						</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<td colspan="3">
						Showing {eVideos?.length ?? 0} result(s)
					</td>
				</tr>
			</tfoot>
		</table>
	</svelte:fragment>
</Pane>
