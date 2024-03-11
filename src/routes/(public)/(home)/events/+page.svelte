<script lang="ts">

</script>

<div class="LandingPage">
	<section class="LandingPage__hero">
		<div class="LandingPage__hero--intro">
			<h1>Events</h1>
			<p>Workshops and events organised by Makerspace at SNIoE</p>
		</div>
	</section>
</div>

<style lang="scss">
	.LandingPage {
		gap: 80px;
		@include box(100%, auto);
		@include make-flex($just: flex-start);

		&__hero {
			@include box(100%, auto);

			@include respondAt(1060px) {
				@include make-flex();
			}

			&--intro {
				& > :global(h1) {
					font-size: 36px;
					font-weight: 700;
					line-height: 1.5;
					text-align: left;
					margin-bottom: 24px;

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

		
	}
</style>