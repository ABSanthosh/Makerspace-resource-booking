<script lang="ts">
	import { CMSStore } from '$store/SupaStore';
</script>

<section class="LocationCard">
	<div class="LocationCard__content">
		<h2>{$CMSStore.data.location.header}</h2>
		<p>{$CMSStore.data.location.location}</p>

		<h2>General Queries?</h2>
		<ul>
			<li>
				Email: <a href="mailto:" target="_blank"> {$CMSStore.data.location.email[0].address} </a>
			</li>
			<li>
				Phone:
				<ul>
					<li>
						{$CMSStore.data.location.phone[0].role}
						<a href="tel:">{$CMSStore.data.location.phone[0].number}</a>
					</li>
					<li>
						{$CMSStore.data.location.phone[1].role}
						<a href="tel:">{$CMSStore.data.location.phone[1].number}</a>
					</li>
				</ul>
			</li>
		</ul>
	</div>
	<span />
</section>

<style lang="scss">
	.LocationCard {
		@include box(100%, 300px);
		display: grid;
		grid-template-columns: 55fr 40fr;
		overflow: hidden;
		border-radius: 28px;
		background: #fff;
		box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.08);
		position: relative;

		@include respondAt(1060px) {
			grid-template-columns: 55fr 30fr;
		}

		@include respondAt(970px) {
			grid-template-columns: 1fr;
		}
		@include respondAt(600px) {
			height: auto;
		}

		& > span {
			background-image: url('/assets/images/map.png');
			border-radius: 0 28px 28px 0;
			width: 100%;
			height: 100%;
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;

			@include respondAt(970px) {
				position: absolute;
				top: 0;
				left: 0;
				z-index: 0;
			}
		}

		&__content {
			padding: 30px 40px;
			@include make-flex($align: flex-start, $just: flex-start);
			gap: 10px;

			& > h2 {
				font-size: 24px;
				font-weight: 600;
				line-height: 1.5;
			}

			& > p {
				font-size: 16px;
				line-height: 1.5;
				text-align: justify;
			}

			z-index: 1;
			@include respondAt(970px) {
				background-color: #00000095;
				border-radius: 28px;
				backdrop-filter: blur(10px);
				& * {
					color: #fff;
				}
			}

			& > ul {
				& > li {
					font-size: 16px;
					line-height: 1.5;
					text-align: justify;

					& > a {
						text-decoration: none;
						font-weight: 600;
					}

					& > ul {
						margin-left: 20px;
						& > li {
							font-size: 16px;
							line-height: 1.5;
							text-align: justify;

							& > a {
								text-decoration: none;
								font-weight: 600;
							}
						}
					}
				}
			}
		}
	}
</style>
