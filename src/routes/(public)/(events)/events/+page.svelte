<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: activeEvents = data.allEvents.filter((event) => new Date(event.endTime) > new Date() && (event.status === "ONGOING" || event.status === "UPCOMING"));
	$: pastEvents = data.allEvents.filter((event) => new Date(event.endTime) < new Date() || event.status === "COMPLETED");
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
			{#if activeEvents.length === 0}
				<p>No active events</p>
			{/if}
			{#each activeEvents as item}
				<a href={`/events/${item.id}`}>
					<div class="LandingPage__event">
						<div class="LandingPage__event--img">
							<img src={item.image} alt="Event" />
						</div>
						<h4>{item.title}</h4>
						<p>{@html item.previewDesc}</p>
						<div class="Row--between LandingPage__event--details">
							<span class="LandingPage__event--user">
								{item.user.name}
							</span>
							<span class="LandingPage__event--date">
								{new Date(item.startTime).toLocaleString('en-US', {
									month: 'long',
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
		<h3 class="w-100">
			Past Events
			<hr />
		</h3>
		<div class="LandingPage__hero--events">
			{#if pastEvents.length === 0}
				<p>No past events</p>
			{/if}
			{#each pastEvents as item}
			<a href={`/events/${item.id}`}>
				<div class="LandingPage__event">
					<div class="LandingPage__event--img">
						<img src={item.image} alt="Event" />
					</div>
					<h4>{item.title}</h4>
					<p>{@html item.previewDesc}</p>
					<div class="Row--between LandingPage__event--details">
						<span class="LandingPage__event--user">
							{item.user.name}
						</span>
						<span class="LandingPage__event--date">
							{new Date(item.startTime).toLocaleString('en-US', {
								month: 'long',
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
				// @include make-flex($dir: row, $just: flex-start, $align: flex-start);
				// flex-wrap: wrap;
				@include box();
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 24px;

				@include respondAt(1024px) {
					grid-template-columns: repeat(2, 1fr);
				}

				@include respondAt(768px) {
					grid-template-columns: repeat(1, 1fr);
				}

				& > a {
					text-decoration: none;
				}

				.LandingPage__event {
					@include box(100%, 100%);
					@include make-flex($dir: column, $just: flex-start, $align: flex-start);
					gap: 12px;
					padding: 1rem;
					border-radius: 10px;
					transition: all 0.15s ease-in-out;

					&:hover {
						// background-color: #fff;
						// box-shadow: #00000020 0px 0px 10px 0px;

						img {
							transform: scale(1.05);
						}
					}

					&--img {
						@include box(100%, auto);
						@include make-flex();
						border-radius: 10px;
						overflow: hidden;

						img {
							height: 100%;
							width: 100%;
							object-fit: cover;
							object-position: center;
							transition: all 0.2s ease-in;
						}
					}

					h4 {
						font-size: 20px;
						font-weight: 600;
					}

					p {
						font-size: 16px;
						line-height: 1.5;
						text-align: justify;
						color: #394451;
					}

					&--details {
						display: flex;
						gap: 1rem;
						justify-items: center;
					}

					&--user {
						font-size: 1rem;
						font-weight: 600;
					}

					&--date {
						font-size: 0.8rem;
						font-weight: 400;
					}
				}
			}
		}
	}
</style>
