<script>// 
// @ts-nocheck

	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
    import { authStore } from "../auth";
    import logo from '$lib/images/logo.png'
  	let user
    const unsubscribe = authStore.subscribe(value => {
       user = value;
     });


    const logout=async()=>{    
        await authStore.logout();
        user=''
        goto('/login');
	}
onMount(() => {
    return () => {
      unsubscribe();
    };
  });
</script>
<div class="container bg-primary p-2 text-primary-content mx-auto w-full">
  <nav class="navbar">
    <div class="navbar-start">      
    <a class="uppercase btn btn-ghost text-xl md:text-2xl" href="/">
      <img src={logo} class="w-10 h-10" alt="logo" >
        ધ ન્યૂ ઇંગલિશ સ્કૂલ ટ્રસ્ટ , વાસદ
      </a>
    </div>
    {#if user}
        <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">          
            <li class="hover:underline hover:font-bold"><a href="/attendance">REGISTRATION</a></li>
            <li class="hover:underline hover:font-bold"><a href="/entry">QR SCANNER</a></li>
            </ul>
        </div>
    {/if}
    <div class="navbar-end">
        {#if !user}
        <a class="hover:underline hover:font-bold btn btn-ghost" href="/login">LOGIN</a>
        {:else}
        <button on:click={logout} class="hover:underline hover:font-bold btn btn-ghost">LOGOUT</button>
        {/if}
    </div>
    {#if user}
        <div class="z-10 dropdown dropdown-end lg:hidden">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <label tabindex="0" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </label>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex 
        -->
        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li class="text-base-content hover:font-bold"><a href="/attendance">REGISTRATION</a></li>
            <li class="text-base-content hover:font-bold"><a href="/entry">QR SCANNER</a></li>
        </ul>
        </div>
    {/if}
  
</nav>
</div>
