<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { Route } from '$lib/routes';
	import { getInitials, getUsernameColor } from '../utils/profilePicture';

	export let user: { email: any; userId: any };
	export let routes: Route[];

	$: navState = false;
	$: collapsibleState = {
		...Object.fromEntries(
			routes.filter((item) => item.children.length > 0).map((item) => [item.route, false])
		)
	} as Record<string, boolean>;

	const profileColor = getUsernameColor(user.userId || 'Loading...');
	const ProfilePicture = {
		backgroundColor: profileColor.backgroundColor,
		textColor: profileColor.textColor
	};
	const initials = getInitials(user.email || 'Loading...');
</script>

<div class="Sidebar" class:open={navState}>
	<div class="Sidebar__logo Row--between gap-15">
		<img src="/assets/images/logo.svg" alt="logo" />
	</div>
	<ul class="Sidebar__menuList">
		{#each routes as route}
			{#if route.children.length === 0}
				<a
					class="Sidebar__menuList--item"
					href={route.route}
					data-active={route.route === $page.url.pathname}
					data-icon={String.fromCharCode(route.icon)}
					title={route.name}
				>
					{route.name}
				</a>
			{:else if route.children.length > 0}
				<details
					class="Sidebar__subMenu"
					open={collapsibleState[route.route]}
					title={!navState ? route.name : ''}
				>
					<!-- svelte-ignore missing-declaration -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<summary
						data-icon={String.fromCharCode(route.icon)}
						data-icon-after={String.fromCharCode(58831)}
						data-active={route.children.some((child) => child.route === $page.url.pathname) ||
							$page.url.pathname === route.route}
						on:click={(e) => {
							e.preventDefault();
							if (!navState) navState = true;
							collapsibleState[route.route] = !collapsibleState[route.route];
						}}
					>
						{route.name}
					</summary>
					<div class="Sidebar__subMenu--content">
						{#each route.children as child}
							<a
								href={child.route}
								class="Sidebar__menuList--item"
								data-active={$page.url.pathname === child.route}
							>
								{child.name}
							</a>
						{/each}
					</div>
				</details>
			{/if}
		{/each}
	</ul>
	<div class="Sidebar__bottom">
		<div class="Sidebar__user">
			<span
				style="background-color: {ProfilePicture.backgroundColor}; color: {ProfilePicture.textColor};"
			>
				{initials}
			</span>
			<div class="Sidebar__bottom--col">
				<p>{user.userId || 'Loading...'}</p>
				<p title={user.email || 'Loading...'}>{user.email || 'Loading...'}</p>
			</div>
			<form method="post" action="/logout" use:enhance>
				<button
					class="FancyButton"
					data-icon={String.fromCharCode(59834)}
					on:click={async () => {}}
					title="Logout"
					type="submit"
				/>
			</form>
		</div>
		<button
			class={`dark  Sidebar__toggle${navState ? '--active' : '--item'}`}
			on:click={() => {
				navState = !navState;
				collapsibleState = {
					...collapsibleState,
					...Object.fromEntries(
						routes.filter((item) => item.children.length > 0).map((item) => [item.route, false])
					)
				};
			}}
			data-icon={String.fromCharCode(58828)}
		/>
	</div>
</div>

<style lang="scss">
	.Sidebar {
		gap: 15px;
		max-height: 100vh;
		@include box(58px);
		overflow-x: hidden;
		@include make-flex();
		background-color: #fafbfb;
		border-right: 3px solid #e5e7eb;
		padding: 20px 8px 10px 10px;
		transition: all 0.3s ease-in-out;

		&.open {
			gap: 30px;
			@include box(250px);
			padding: 40px 20px 15px 20px;

			.Sidebar__menuList {
				@include box(calc(100% + 15px), fit-content);

				scrollbar-gutter: stable;
				padding-left: 6px;
				margin-left: -13px;
			}
		}

		&__logo {
			img {
				width: 100%;
				height: 80%;
				object-fit: contain;
			}
		}

		&__menuList {
			gap: 10px;
			flex-grow: 1;
			direction: rtl;
			overflow-y: auto;
			overflow-x: hidden;
			@include box(100%, fit-content);
			@include make-flex($just: flex-start, $dir: column);

			& > * {
				direction: ltr;
			}

			&--item,
			summary {
				gap: 8px;
				flex-shrink: 0;
				color: #344054;
				cursor: pointer;
				padding: 0px 8px;
				border-radius: 7px;
				position: relative;
				line-height: normal;
				white-space: nowrap;
				text-decoration: none;
				@include box(100%, 35px);
				background-color: #fafbfb;
				border: 1px solid transparent;
				@include make-flex($dir: row, $just: flex-start);

				&[data-active='true'] {
					background-color: #ebedf0;
				}

				&:not(&[data-active='true']) {
					&:hover,
					&:focus {
						outline: none;
						background-color: #f4f5f6;
					}
				}
			}
		}

		&__toggle {
			&::before {
				transition: transform 0.3s;
			}

			&--active,
			&--item {
				border: 1px solid #eaecf0;
				outline: none;
				cursor: pointer;
				border-radius: 5px;
				background-color: rgb(241, 241, 241);
				@include box(100%, 37px);
				@include make-flex();

				&:hover,
				&:focus {
					outline: none;
					background-color: #f4f5f6;
				}
			}

			&--active {
				align-items: flex-end !important;
				padding-right: 10px;
				&::before {
					transform: rotate(180deg);
				}
			}
		}

		&__subMenu {
			@include box(100%, auto);

			&[open] {
				summary {
					&::after {
						transform: rotate(0deg);
					}
				}
			}

			& > summary {
				list-style: none;
				&::after {
					transition: transform 0.2s ease-in-out;
					transform: rotate(-90deg);
					margin-left: auto;
				}
				&::-webkit-details-marker {
					display: none;
				}
			}

			&--content {
				gap: 8px;
				padding: 8px;
				margin-top: 10px;
				border-radius: 7px;
				white-space: nowrap;
				@include make-flex();
				@include box(100%, auto);
				border: 1px solid #3440543b;
			}
		}

		&__user {
			display: grid;
			grid-template-columns: 40px 1fr 25px;
			@include box($height: auto);
			gap: 10px;
			border-top: 1px solid #eaecf0;
			border-bottom: 1px solid #eaecf0;

			align-items: end;
			padding: 10px 0 10px 0;

			img {
				border-radius: 50%;
				border: 1px solid black;
				@include box(38px, 38px);
			}

			&--col {
				overflow: hidden;

				p {
					text-overflow: ellipsis;
					overflow: hidden;

					&:first-child {
						font-size: 16px;
						font-weight: 600;
					}

					&:last-child {
						font-size: 14px;
						font-weight: 500;
						color: #84878d;
					}
				}
			}

			& > span {
				border-radius: 50%;
				@include box(38px, 38px);
				@include make-flex();
				font-weight: bolder;
			}

			button {
				@include box(auto);
				@include make-flex();
				font-size: 22px;
				outline: none;
				border: none;
				background-color: transparent;
				cursor: pointer;
			}
		}

		&__bottom {
			@include make-flex();
			gap: 15px;
			@include box(100%, auto);

			&--col {
				overflow: hidden;

				p {
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}
			}
		}
	}
</style>
