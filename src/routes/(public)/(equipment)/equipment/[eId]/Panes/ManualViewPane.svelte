<script lang="ts">
	import Pane from '$components/Pane.svelte';
	import { SupabaseEnum } from '$lib/Enums';
	import { getStorageUrl } from '$lib/SupabaseUtils';
	import type { ESchema } from '$lib/schemas';
	import type { Manual } from '@prisma/client';

	export let { currentEquipment, modal } = $$props as {
		modal: boolean;
		currentEquipment: (ESchema & { manuals: Manual[] }) | null;
	};

	$: eManuals = currentEquipment?.manuals!;
</script>

<Pane bind:open={modal} style="--paneWidth: 450px;" on:close={() => (modal = false)}>
	<p slot="header">Manuals: {currentEquipment?.name}</p>
	<svelte:fragment slot="main">
		<table class="FancyTable">
			<thead>
				<tr>
					<th style="width: 100%;"> Name </th>
				</tr>
			</thead>
			<tbody>
				{#if eManuals.length === 0}
					<tr>
						<td colspan="2">
							<i class="CrispMessage" data-type="info" data-format="box"> No Manuals found </i>
						</td>
					</tr>
				{/if}
				{#each eManuals as item}
					<tr>
						<td colspan="2">
							<label for={`edit.name-${item.id}`} class="CrispLabel">
								<span style="color: inherit;" data-mandatory> Name </span>
								<input
									type="text"
									name={`edit.name-${item.id}`}
									bind:value={item.name}
									class="CrispInput"
									disabled
								/>
							</label>
							<br />
							<a
								href={getStorageUrl(SupabaseEnum.MANUAL, item.pdf)}
								target="_blank"
								rel="noopener noreferrer"
								class="CrispButton"
								style="--crp-button-height: 30px"
							>
								View PDF
							</a>
							<br />
						</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<td colspan="3">
						Showing {eManuals?.length ?? 0} result(s)
					</td>
				</tr>
			</tfoot>
		</table>
	</svelte:fragment>
</Pane>
