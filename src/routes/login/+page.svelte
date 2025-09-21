<script>	
	import { authStore } from '../../auth.js'
	
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	let email = '',password = '';
	let error = '',loading=false;
	async function login() {
	  try {
		loading=true	
		await authStore.login(email,password);	
		goto('/entry');

	} catch (err) {
		console.log(err);
		error = 'Invalid login credentials';
	  }
	  finally{
		loading=false
	  }
	}
	onMount(() => {				
	  });
  </script>
<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login" />
</svelte:head>
<div>	
	{#if loading}
	<div class="fixed inset-0 flex items-center justify-center bg-base-100 opacity-50 z-50">
	  <div class="loading loading-spinner text-primary w-14"></div>
	</div>
  {/if}
  <h2 class="my-4 text-xl md:text-2xl p-2 uppercase border-b font-bold w-full">Login</h2>
  {#if error}
	<p style="color: red;">{error}</p>
  {/if}
  <form on:submit|preventDefault={login}>
	  <div class="m-4">
		<label class="block text-sm font-medium mb-2 ml-2 md:text-md">Email</label>
		<input type="email" bind:value={email} class="input input-bordered w-full" required />
	  </div>
	  <div class="m-4">
		<label class="block text-sm font-medium mb-2 ml-2 md:text-md">Password</label>
		<input type="password" bind:value={password} class="input input-bordered w-full" required />
	  </div>

	  <div class="flex justify-end">
	  <button type="submit" class="btn btn-primary p-1 w-full md:w-48">LOGIN</button></div>
	</form>
</div>


