<script lang="ts">
	import { SessionStore } from '$store/SupaStore';

	$: user = $SessionStore!.user;
</script>

<main class="Dashboard">
	<h1>
		Hello, {user.user_metadata.name}!
	</h1>
</main>

<style lang="scss">
	.Dashboard {
		gap: 64px;
		@include box();
		margin: 64px auto;
		max-width: $maxDashWidth;
		@include make-flex($just: flex-start, $align: flex-start);

		& > h1 {
			font-size: 30px;
			font-weight: 500;
		}
	}
</style>
