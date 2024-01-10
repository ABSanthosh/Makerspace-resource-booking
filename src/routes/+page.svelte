<script lang="ts">
	export let data;
	$: ({ supabase, session } = data);

	$: console.log({ supabase, session });
</script>

<div>
	{#if session != null}
		<p>You are logged in as {session.user.email}</p>
		<button on:click={() => supabase.auth.signOut()}>Sign out</button>
	{:else}
		<button
			on:click={async () => {
				await supabase.auth.signInWithOAuth({
					provider: 'google',
					options: {
						redirectTo: `${location.origin}/auth/callback`,
						queryParams: {
							access_type: 'offline',
							prompt: 'consent'
						}
					}
				});
			}}
		>
			Continue with Google
		</button>
	{/if}
</div>
