<script lang="ts">
	import LocationCard from '$components/LocationCard.svelte';
	import { CMSStore } from '$store/SupaStore';
	const data = $CMSStore.find((item) => item.pathname === '/')?.data;
</script>

<div class="LandingPage">
	<section class="LandingPage__hero">
		<div class="LandingPage__hero--intro Col--a-start">
			{@html data.hero}
		</div>
		<div class="LandingPage__slot">
			<h3>Makerspace Hours</h3>
			<ul>
				{#each data.hours as hour}
					<li>
						{hour.day}
						<hr />
						{hour.from} - {hour.to}
					</li>
				{/each}
			</ul>
			<a href="/equipment" class="CrispButton w-100" data-type="dark-blue">Book a slot</a>
		</div>
	</section>
	<LocationCard />
</div>

<style lang="scss">
	.LandingPage {
		gap: 80px;
		@include box(100%, auto);
		@include make-flex($just: flex-start);

		&__hero {
			gap: 24px;
			display: grid;
			grid-template-columns: 1fr 300px;

			@include respondAt(1060px) {
				@include make-flex();
			}

			&--intro {
				& > :global(h1) {
					font-size: 36px;
					font-weight: 700;
					line-height: 1.5;

					@include respondAt(500px) {
						font-size: 32px;
					}

					@include respondAt(400px) {
						font-size: 28px;
					}
				}
				& > :global(p) {
					font-size: 17px;
					line-height: 1.5;
					text-align: justify;

					@include respondAt(500px) {
						font-size: 16px;
					}

					@include respondAt(400px) {
						font-size: 15px;
					}
				}
			}
		}

		&__slot {
			border-radius: 8px;
			background: var(--lightBlue);
			box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.07);
			padding: 15px;
			height: fit-content;
			@include make-flex();
			gap: 20px;

			@include respondAt(1060px) {
				@include box(100%, auto);
			}

			& > h3 {
				font-size: 18px;
				@include box(100%, auto);
				font-weight: 600;
				// margin-bottom: 10px;
			}

			& > ul {
				list-style: none;
				gap: 10px;
				@include make-flex();
				@include box(100%, auto);

				& > li {
					font-size: 16px;
					@include box(100%, auto);

					@include make-flex($dir: row, $just: space-between);
					line-height: 1.5;
					gap: 10px;
					& > hr {
						margin: 0;
						border: 0;
						flex: 1;
						border-top: 1px solid #ccc;
						text-align: center;
					}
				}
			}
		}
	}
</style>
