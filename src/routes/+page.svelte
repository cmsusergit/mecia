<script>//
// @ts-nocheck

import {onMount} from "svelte";
import {toDataURL} from 'qrcode'
import {supabase} from '../auth'
let dataTble
let currentPage=0,perPage=5
let stRecord=currentPage,endRecord=stRecord+perPage-1
let totalPage=1,loading=false
let mesg='',error_mesg=''
let searchBy='name',searchText=''

const fetchPhotoUrl=(fn)=>{
	const { data:dt } = supabase.storage.from('form-photo').getPublicUrl(fn);
	return dt.publicUrl
}
const getQR=async(id)=>{
	const dt=await toDataURL(''+id)
	return dt
}
const calculateNumberOfRecord=()=>{
	stRecord=currentPage*perPage
	endRecord=stRecord+perPage-1
	fetchTble()
}
const fetchTble=async()=>{
	try { 
		loading=true
		let { data: dataTble1,count:count, error } = await supabase
		.from('DataTble')
		.select('*',{count:'exact'}).ilike(searchBy,`%${searchText}%`)
		.range(stRecord, endRecord)
		if(dataTble1){
			dataTble=dataTble1		
			totalPage=Math.ceil(count/perPage)				
		}
		if(error){
			console.log('****',error.message);		
			mesg=''
			error_mesg=error.message	
		}
	}catch(error){
		console.log('****',error)	
		mesg=''
		error_mesg=error.message	
	}
	finally{
		loading=false
	}
}
onMount(()=>{
	fetchTble()
})
</script>

{#if loading}
	<div class="fixed inset-0 flex items-center justify-center bg-base-100 opacity-50 z-50">
	  <div class="loading loading-spinner text-primary w-14"></div>
	</div>
{/if}
{#if mesg}
	<div role="alert" class="toast toast-middle alert alert-success p-2">
	<span>{mesg}</span>
	<div>
		<button on:click={()=>{mesg=''}} class="btn btn-sm btn-secondary p-2">CLOSE</button>
		</div>
		
	</div>
{/if}
{#if error_mesg}
	<div role="alert" class="toast toast-middle alert alert-error">
	<span>{error_mesg}</span>
	<div>
		<button on:click={()=>{error_mesg=''}} class="btn btn-sm btn-primary">CLOSE</button>
		</div>
	</div>
{/if}
{#if dataTble}
	<div class="flex justify-end p-2 my-4 join border-b">
		<input on:change={()=>{fetchTble()}} bind:value={searchText} type="text" class="join-item p-2 input input-bordered w-1/2" placeholder={`search by ${searchBy}`}>
		<select bind:value={searchBy} class="join-item select p-2 select-bordered text-base-content w-1/4">
			<option value="name">Name</option>
			<option value="contact">Contact</option>
			<option value="aadhar_number">Aadhaar Number</option>
			<option value="city">City/Village</option>
		</select>
		<button on:click={()=>{fetchTble()}} class="join-item p-2 btn btn-primary md:w-48" type='button'>SEARCH</button>
	</div>
	<div class="overflow-x-auto">
	<table class="table">
		<thead>
		<tr>
			<th class="font-bold text-center">Name</th>
			<th class="font-bold text-center">Contact</th>
			<th class="font-bold text-center">Aadhaar Number</th>
			<th class="font-bold text-center">Address</th>
			<th class="font-bold text-center">City/Village</th>
			<th class="font-bold text-center">QR</th>
			<th class="font-bold text-center"></th>
		</tr>
		</thead>
		<tbody>
			{#each dataTble as record}
		<tr>
			<td class='text-base-content text-center'>
			<div class="flex items-center gap-3">
				<div class="avatar">
					<div class="mask mask-squircle h-12 w-12">
						<img  src={fetchPhotoUrl(record.photo)} alt={record.photo} />
					</div>
				</div>

				<div>				
					<div class="font-bold">{record.name}</div>
				</div>
			</div>
			</td>
			<td class='text-base-content text-center'>
				{record.contact}
			</td>
			<td class='text-base-content text-center'>
				{record.aadhar_number}
			</td>
			<td class='text-base-content text-center'>{record.addr}</td>
			<td class='text-base-content text-center'>{record.city}</td>
			<td class='flex justify-center'>
				{#await getQR(record.id)}
					<p>Fetching QR</p>
				{:then rr} 					
					<img src={rr} alt="" srcset="">
				{/await}
			</td>
			<th>
				<button class="btn btn-ghost btn-xs">details</button>
			</th>
		</tr>
		{/each}
		</tbody>
		<tfoot>
			<tr>
				<td class='p-2 text-center' colspan="7">
					<div class="flex justify-center join p-2">
						<button on:click={()=>{currentPage=(currentPage-1)<0?0:(currentPage-1);calculateNumberOfRecord();}} class="join-item btn-sm btn border-r">«</button>
						<button class="join-item  btn-sm btn w-24" disabled>{currentPage+1}/{totalPage}</button>
						<button on:click={()=>{currentPage=(currentPage+1)>=(totalPage-1)?(totalPage-1):(currentPage+1);calculateNumberOfRecord();}} class="join-item  btn-sm btn border-l">»</button>
					</div>
				</td>
			</tr>
		</tfoot>
	</table>
	</div>
{/if}

<!-- <script>
	import '../lib/images/inputtext.css'

	import { onMount } from "svelte";
	// @ts-ignore
	let selectedOption=''
	const shuffleText=(label)=>{
	if(!label)
			return
	let itration=0,originalText=label.innerText
	const charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const shuffleText1=(/** @type {HTMLElement | null} */ label)=>{
		let shuffledText = '';
		for (let i = 0; i < originalText.length; i++) {
			if (i < itration) {
		
				shuffledText += originalText[i];
			} else {

				shuffledText += charList.charAt(Math.floor(Math.random() * charList.length));
			}
		}
		if(!label)
			return
		label.innerText = shuffledText;
		itration += 1 / 4;
		if (itration <= originalText.length) {
			requestAnimationFrame(()=>shuffleText1(label));
		} else {
			itration = 0;
		}
	}
	shuffleText1(label)
}
// @ts-ignore
function onInputFocus( ev ) {
	ev.target.parentNode.classList.add('input--filled');
}
// @ts-ignore
function onInputBlur( ev ) {
	if( ev.target.value.trim() === '' ) {
		ev.target.parentNode.classList.remove('input--filled')
	}
}
const initField=()=>{
	document.querySelectorAll( 'input.input__field' ).forEach( function( inputEl ) {
		// @ts-ignore
		if( inputEl.value.trim() !== '' ) {						
			// @ts-ignore
			inputEl.parentNode.classList.add('input--filled');
		}
		inputEl.addEventListener( 'focus', onInputFocus );
		inputEl.addEventListener( 'blur', onInputBlur );
	} );
	document.querySelectorAll( 'select.input__field' ).forEach( function( inputEl ) {
		// @ts-ignore
		if( inputEl.value.trim() !== '' ) {						
			// @ts-ignore
			inputEl.parentNode.classList.add('input--filled');
		}
		inputEl.addEventListener( 'focus', onInputFocus );
		inputEl.addEventListener( 'blur', onInputBlur );
	} );
}
onMount(()=>{
	shuffleText(document.getElementById('text'))
	initField()
})				
</script>
<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<section class="container">	
	<h2 id='text' class="font-bold uppercase justify-center flex text-xl md:text-4xl">MECIA2.0 Registration</h2>
	
	<div class="mx-auto w-10/12">		
		<span class="input1 input--kuro">
			<input class="input__field input__field--kuro" type="text" id="teamname" />
			<label class="input__label input__label--kuro" for="teamname">
				<span class="input__label-content input__label-content--kuro uppercase font-bold">team name</span>
			</label>
		</span>


		<span class="input1 input--kuro">
			<input class="input__field input__field--kuro" type="text" id="prob" />
			<label class="input__label input__label--kuro" for="prob">
				<span class="input__label-content input__label-content--kuro uppercase font-bold">Problem Defination</span>
			</label>
		</span>
		<span class="input1 input--kuro">
			<select class="input__field input__field--kuro"  id="approch">
				<option value="" disabled selected></option>
				<option value="test1">HARDWARE</option>
				<option value="test2">SOFTWARE</option>
			</select>
			<label class="input__label input__label--kuro" for="approch">
				<span class="input__label-content input__label-content--kuro uppercase font-bold">select approch</span>
			</label>
		</span>
		<span class="input1 input--kuro">
			<select class="input__field input__field--kuro"  id="domain">
				<option value="" disabled selected></option>
				<option value="test1">HARDWARE</option>
				<option value="test2">SOFTWARE</option>
			</select>
			<label class="input__label input__label--kuro" for="domain">
				<span class="input__label-content input__label-content--kuro uppercase font-bold">select domain</span>
			</label>
		</span>
	</div>
</section>
<style>
</style>
 -->