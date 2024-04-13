<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ event } = data);
</script>

<div class="Event">
	<div class="Event__background"></div>
	<section class="Event__content">
		<h1 class="Event__content--title">{event.title}</h1>
		<div class="Event__content--desc">{@html event.previewDesc}</div>
		<img src={event.image} alt="Event" class="Event__content--image" />
		<div class="Event__content--author">
			<div class="Event__content--author-profile">
				<div class="Event__content--author-image"></div>
				<!-- 
          TODO: use profilePicture.ts to generate initials from user name and make a circle with the initials and use background color and 
          color returned from getUsernameColor function
        -->
				{event.user.name}
			</div>
			<div class="Event__content--author-dates">
				<p>
					{new Date(event.createdAt).toLocaleString('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric',
						hour12: true,
						hour: '2-digit',
						minute: '2-digit'
					})}
					: Created
				</p>
				<p>
					{new Date(event.updatedAt).toLocaleString('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric',
						hour12: true,
						hour: '2-digit',
						minute: '2-digit'
					})}
					: Updated
				</p>
			</div>
		</div>
		<hr class="Event__content--divider" />
		<p class="Event__content--paragraph">
			{@html event.desc}
		</p>
	</section>
</div>

<style lang="scss">
	.Event {
		@include box($height: auto);
		@include make-flex();
		padding: 30px 20px 20px 20px;
		gap: 24px;
		position: relative;
		z-index: 0;

		@include respondAt(1024px) {
			padding: 30px 10px 20px 10px;
		}

		&__background {
			position: absolute;
			background-color: #22272e;
			z-index: -1;
			height: 70vh;
			width: 100%;
			top: 0;
			left: 0;

			@include respondAt(768px) {
				height: 50vh;
			}

		}

		&__content {
			padding: 30px 200px;
			max-width: $maxWidth;
			@include box(100%, auto);
			@include make-flex($just: flex-start, $align: flex-start, $dir: column);
			margin-top: 64px;
			gap: 24px;

			@include respondAt(1024px) {
				padding: 30px 100px;
			}

			@include respondAt(768px) {
				padding: 30px 50px;
			}
			
			@include respondAt(480px) {
				padding: 30px 20px;
			}

			&--title {
				font-size: 36px;
				font-weight: 700;
				line-height: 1;
				text-align: left;
				color: white;
			}

			&--desc {
				font-size: 17px;
				line-height: 0.5;
				text-align: justify;
				color: #cbcbcb !important;

				:global(*) {
					color: #cbcbcb !important;
					line-height: 1.5rem;
				}
			}

			&--image {
				@include box();
				aspect-ratio: 16 / 9;
			}

			&--author {
				@include make-flex($just: space-between, $dir: row);
				@include box();
				gap: 24px;

				@include respondAt(768px) {
					flex-direction: column;
					align-items: flex-start;
				}

				&-profile {
					@include make-flex(row, center, flex-start);
					gap: 18px;
				}

				&-image {
					@include box(50px, 50px);
					border-radius: 50%;
					background-color: #ff6161;
				}

				&-dates {
					@include make-flex($just: flex-start, $align: flex-start, $dir: column);
					gap: 5px;

					p {
						font-size: 0.8rem;
						font-style: italic;
						color: #646464;
					}
				}
			}

			&--divider {
				width: 100%;
				border: 1px solid #cbcbcb;
			}

			&--paragraph {
				text-align: justify;
			}
		}
	}
</style>
