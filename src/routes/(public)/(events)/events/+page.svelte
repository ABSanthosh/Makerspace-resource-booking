<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="LandingPage">
	<section class="LandingPage__hero">
		<div class="LandingPage__hero--intro">
			<h1>Events</h1>
			<p>Workshops and events organised by Makerspace at SNIoE</p>
		</div>
		<h3 class="w-100">
			Active Events
			<hr />
		</h3>
		<div class="LandingPage__hero--events">
			{#each data.allEvents as item}
				<a href={`/events/${item.id}`}>
					<div class="LandingPage__event">
						<img src={item.image} alt="Event" />
						<h4>{item.title}</h4>
						<p>{item.previewDesc}</p>
						<div class="Row--between w-100">
							<span>
								{item.user.name}
							</span>
							<span>
								{new Date(item.startTime).toLocaleString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric',
									hour12: true,
									hour: '2-digit',
									minute: '2-digit'
								})}
							</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>
</div>

<style lang="scss">
	.LandingPage {
		padding: 30px 20px 20px 20px;
		margin-top: 64px;
		max-width: $maxWidth;
		gap: 80px;
		@include box(100%, auto);
		@include make-flex($just: flex-start);

		&__hero {
			@include box();
			@include make-flex(column, flex-start, flex-start);
			gap: 24px;

			&--intro {
				& > :global(h1) {
					font-size: 36px;
					font-weight: 700;
					line-height: 1.5;
					text-align: left;

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

			h3 {
				gap: 15px;
				font-size: 25px;
				font-weight: 500;
				@include make-flex($dir: row, $just: flex-start);

				hr {
					margin: 10px 0;
					flex: 1;
					border: 1px solid var(--border);
				}
			}

			&--events {
				@include make-flex($dir: row, $just: space-between, $align: flex-start);
				flex-wrap: wrap;
				gap: 24px;

				& > a {
					text-decoration: none;
				}

				.LandingPage__event {
					@include box(24rem, 100%);
					@include make-flex($dir: column, $just: flex-start, $align: flex-start);
					gap: 15px;
					padding: 1rem;
					border-radius: 10px;
					transition: all 0.15s ease-in-out;

					&:hover {
						background-color: #fff;
						box-shadow: #00000020 0px 0px 10px 0px;
					}

					img {
						@include box(100%, auto);
						border-radius: 5px;
					}

					h4 {
						font-size: 20px;
						font-weight: 500;
					}

					p {
						font-size: 16px;
						line-height: 1.5;
						text-align: justify;
					}
				}
			}
		}
	}
</style>
