<script>//    
// @ts-nocheck

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {browser} from '$app/environment'
	import { onMount } from 'svelte';
	import '../app.css';	
	import { authStore } from '../auth.js';	
	import Header from './Header.svelte';
	let user,isLoggedIn
	let theme=browser?(localStorage.getItem('theme') || 'light'):'light'

	const themeList = ['light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter', 'dim', 'nord', 'sunset'];
	$: {
	if(theme){
		if(browser){
			document.documentElement.setAttribute('data-theme', theme);
			localStorage.setItem('theme', theme);
		}
	}}
	const unsubscribe = authStore.subscribe(value => {
		user = value;
	  });
	  onMount(() => {
		theme = browser?localStorage.getItem('theme') || 'light':'light'
		return () => {
		  unsubscribe();
		};
	  });
  </script>
<div class="bg-transparent text-slate-800 p-2 min-h-screen">
  	<Header></Header>
	<main class="md:w-11/12 mx-auto min-h-screen p-2">
		{#if !user}
			{#if $page.url.toString().includes('login')}
				<slot />
			{:else}
				<p class="bg-primary text-primary-content p-4 text-xl w-full">Please Login</p>
			{/if}
		{:else}
			<slot/>			
		
			{/if}
	</main>
	<footer>
		<div class="container bg-primary text-primary-content  mx-auto flex space-between px-4 py-2">

			<p class="w-full text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, sit.</p>
			<select bind:value={theme} class="select select-base w-full text-base-content select-sm md:w-1/4 self-end px-2">			
				{#each themeList as themeOption}
					<option value={themeOption}>{themeOption}</option>
				{/each}
			</select>
		</div>
	</footer>
</div>
<style>	
</style>
