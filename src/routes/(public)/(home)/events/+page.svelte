<script lang="ts">

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
			<div class="LandingPage__event">
				<img src="/assets/images/event.png" alt="Event" />
				<h4>3D printing workshop for school students</h4>
				<p>Selected schools from all over Delhi can send upto 10 students to for a 3 day 3d printing workshop at SNIoE</p>
				<p>Created at: February 29, 2024</p>
			</div>	
		</div>
	</section>
</div>

<style lang="scss">
	.LandingPage {
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
		}

		
	}
</style>