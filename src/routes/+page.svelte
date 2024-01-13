<script lang="ts">
	export let data;

	$: ({ supabase, session } = data);
	// console.log(data)
</script>

<div>
	{#if session != null}
		<p>You are logged in as {session.user.email}</p>
		<ul>
			<li><a href="/admin">Admin</a></li>
			<li><a href="/dash">Dashboard</a></li>
			<li><a href="/equipment">Equipment</a></li>
		</ul>
		<br />
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
