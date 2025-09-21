<script>//
// @ts-nocheck

import {onMount} from "svelte";
import logobg_voluntr from "$lib/images/bg_volantr.png"
import logo from '$lib/images/logo.png'
import logobg_male from '$lib/images/bg_male.png'
import logobg_female from '$lib/images/bg_female (2).png'
import logobg_sponsor from '$lib/images/bg_sponsor.png'
import logobg_trustee from '$lib/images/guest_trustee.png'
import logobg_member from '$lib/images/gg.png'
import {toDataURL} from 'qrcode'

import {supabase} from '../auth'
import { goto } from "$app/navigation";

let dataTble,currRecord=null
let currentPage=0,perPage=20
let stRecord=currentPage,endRecord=stRecord+perPage-1
let totalPage=1,loading=false
let mesg='',error_mesg=''
let searchBy='name',searchText=''
let recordToRemove='',totalCount=0
let selectBy='_',selectedOption='Vasad'
$:{
	if(selectBy || selectedOption)
		fetchTble()
}
const fetchPhotoUrl=(fn)=>{
	const { data:dt } = supabase.storage.from('form-photo').getPublicUrl(fn);
	return dt.publicUrl
}
const getQR=async(id,fontcolor)=>{
	const dt=await toDataURL(''+id,{color:{dark:fontcolor, light: '#00000000'}})
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
		const filtr=selectBy=='_'?'%%':`${selectBy}%`
		const filtr1=selectedOption=='Other'?'%%':`%Vasad%`		
		let dbquery1= supabase.from('DataTble')
		.select('*',{count:'exact'}).ilike(searchBy,`%${searchText}%`).ilike('category',filtr)
		if(selectedOption=='Other')
			dbquery1=dbquery1.not('city','ilike','Vasad')
		else
			dbquery1=dbquery1.ilike('city','%vasad%')
		let { data: dataTble1,count:count, error } = await dbquery1.range(stRecord,endRecord)
		if(dataTble1){
			dataTble=dataTble1			
			totalPage=Math.ceil(count/perPage)				
			totalCount=count
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
const generateCanvas=(record) =>{
			currRecord=record
            const canvas = document.getElementById('idCardCanvas');
            const ctx = canvas.getContext('2d');
			// 
            // Fill background
			const logobg1 = new Image();			
			logobg1.src =(record.category=='Commitee Member')?logobg_member:
			
			((record.category=='TRUSTEE')?logobg_trustee:((record.category=='VOLUNTEER')?logobg_voluntr:((record.category=='SPONSOR')?logobg_sponsor:((record.category=='MALE')?logobg_male:logobg_female))))
            logobg1.onload = ()=> {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(logobg1,-12,0, canvas.width+24, canvas.height+2)
				// ctx.fillStyle = "#fffff";
				// ctx.fillRect(0, 0, canvas.width, canvas.height);
				// 
				// Header section: Title on the left, logo on the right
				const headerHeight = 80;  // Set header height
				const footHeight = 40;  // Set footer height
				// 
				// Add title on the left (align vertically center in header)
				let fontcolor=record.category=='MALE'?"#eef":((record.category=='VOLUNTEER'||record.category=='Commitee Member')?'#002':'#fff')
				ctx.font = "bold 14px courier";
				ctx.fillStyle = fontcolor;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle"
				ctx.save();						
				ctx.translate(20, canvas.width);
				ctx.rotate(-Math.PI / 2);
				ctx.fillText("આદ્યાશક્તિ ગરબા મહોત્સવ, વાસદ", 0, 10);	
				ctx.restore();
				if(record.category=='Commitee Member'){

				}
				if(record.category=='TRUSTEE' || record.category=='Commitee Member'){
						ctx.save()
						ctx.textAlign='center'
						ctx.font="bold 28px courier"
						ctx.fillText(record.category=='TRUSTEE'?'GUEST':'NEST',canvas.width/2,70)
						ctx.restore()
					}

					if(record.category=='SPONSOR'){
					ctx.save()
					ctx.font="bold 20px courier"
					ctx.fillText('SPONSOR',canvas.width/2,70)
					ctx.restore()
			
					

					
					ctx.save()
					ctx.textAlign='center'
					ctx.textBaseline='middle'
					ctx.font="bold 18px courier"
					const temp1=record.name.split(/[\s,.//()]/)
					for(let indx=0;indx<temp1.length;indx++)
						ctx.fillText(temp1[indx],canvas.width/2+5,(canvas.height-temp1.length*20-50)+indx*20)
					ctx.restore()
				}
				else{	
					ctx.font = "bold 18px courier";
					if(record.name.length>20){
						const temp1=record.name.split(" ")
						record.name=temp1[0]+" "+temp1[1]
					}
					ctx.save();						
					ctx.translate(20, canvas.width);
					ctx.rotate(-Math.PI / 2);
					ctx.fillText(record.name,0,(canvas.width-40))
					ctx.restore();
				}

				// 
				// Add logo on the right (align vertically centr in header)
				// const logo1 = new Image();			
				// logo1.src = logo;
				// logo1.onload = ()=> {
				// 	const logoWidth = 40;  // Width of the logo
				// 	const logoHeight = 40; // Height of the logo
				// 	ctx.drawImage(logo1, canvas.width - logoWidth - 5, 25, logoWidth, logoHeight)
					
				// 	ctx.drawImage(logo1, 5, 25, logoWidth, logoHeight)
				// 	ctx.save()				
				// 	ctx.fillStyle='#ffd008'
				// 	ctx.fillRect(0,0,canvas.width,5)
				// 	ctx.restore()
					drawMiddleImage(record,ctx, canvas, headerHeight, footHeight);
				// };		
				// ctx.save()
				// ctx.fillStyle='#ffd008'
				// ctx.fillRect(0,canvas.height-48,canvas.width,48)
				// console.log(record)				
				if(record.category=='VOLUNTEER')
					ctx.fillText('Volunteer',canvas.width/2+5,canvas.height-50)
				ctx.fillText('૨૦૨૫',canvas.width/2+5,canvas.height-28)
				// 
				// ctx.restore()
			};
        }
	const drawMiddleImage=async(record,ctx, canvas, headerHeight, footHeight) =>{
		const img1 = new Image();
		const img2 = new Image();
		function loadImageAsBase(url) {
		return fetch(url)
			.then(response => response.blob())
			.then(blob => {
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result);
					reader.onerror = reject;
					reader.readAsDataURL(blob);
				});
			});
		}
		const encoded=await loadImageAsBase(fetchPhotoUrl(record.photo))
		img1.src = encoded
		
		let fontcolor=record.category=='MALE'?"#eef":((record.category=='VOLUNTEER'||record.category=='Commitee Member')?'#002':'#fff')
		img2.src = await getQR(record.uuid,fontcolor)
		img1.onload = function () {
			img2.onload = function () {
				const availableHeight = canvas.height - headerHeight - footHeight
				const imgHeight = 80	
				const imgWidth = 80
  				const totalWidth = imgWidth * 2 + 20
				const startX = canvas.width/2-40				
				const startY = 25+ headerHeight + (availableHeight - imgHeight) / 2
				// 
				// Draw the two images side by side
				if(record.category!=='TRUSTEE' && record.category!='Commitee Member')
					ctx.drawImage(img1, startX, startY-57, imgWidth, imgHeight);
				ctx.drawImage(img2, startX, canvas.height-140, imgWidth, imgHeight);
			};

		};
	}
	const saveToImage=async(record)=>{ 				
			await generateCanvas(record)
			currRecord=''
			const canvas=document.getElementById('idCardCanvas')
			const imgData = await canvas.toDataURL('image/png');				
			const url1 = document.createElement('a');
			url1.href = imgData;
			url1.download = 'canvas-image.png';
			url1.click();			//download
			//download
	}
	const removeRecord=async()=>{
		try {
			loading=true


			const { error } = await supabase
			.from('DataTble')
			.delete()
			.eq('id', recordToRemove)
			mesg="Successfully Removed"
			dataTble=null
			location.reload()
		} catch (error) {			
			console.log('****',error)			
		}
		finally{
			recordToRemove=''
			loading=false			
		}
	}
	const printId=()=>{
			const canvas=document.getElementById('idCardCanvas')
			const dataUrl = canvas.toDataURL("image/png");//to download
			const printWindow = window.open('', '_blank');//to urldowload
			printWindow.document.write('<html><head><title>Print Canvas</title></head><body>');
			printWindow.document.write('<img src="' + dataUrl + '" style="width:240;height:387">');
			printWindow.document.write('</body></html>');
			printWindow.document.close();
			printWindow.onload = function() {
			printWindow.focus();
			printWindow.print();
			printWindow.close();
		};
}
</script>

{#if loading}
	<div class="fixed inset-0 flex items-center justify-center bg-base-100 opacity-50 z-50">
	  <div class="loading loading-spinner text-primary w-14"></div>
	</div>
{/if}
{#if mesg}
	<div role="alert" class="toast toast-middle alert alert-success p-2 z-50">
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
			<!--
				 <option value="aadhar_number">Aadhaar Number</option>
			 -->
			<option value="city">City/Village</option>
		</select>
		<button on:click={()=>{fetchTble()}} class="join-item p-2 btn btn-primary md:w-48" type='button'>SEARCH</button>
	</div>
	<div class="flex justify-end p-2 my-4 join border-b">
		<div class="mx-4 flex gap-2 px-2 py-2">
			<label class="label cursor-pointer" for="option1">
				<input type="radio" id="option1" value="Vasad" bind:group={selectedOption} class="radio radio-primary"/>
				<span class="label-text ml-2">Vasad</span>
			</label>
			<label class="label cursor-pointer" for="option2">
				<input type="radio" id="option2" value="Other" bind:group={selectedOption} class="radio radio-primary"/>
				<span class="label-text ml-2">Other</span>
			</label>
		</div>
		<select id="selectbycategory" bind:value={selectBy} class="join-item select p-2 select-bordered text-base-content w-1/4">
			<option selected value="_"></option>
			<option>MALE</option>
			<option>FEMALE</option>
			<option>SPONSOR</option>
			<option>TRUSTEE</option>
			<option>VOLUNTEER</option>	
			<option>Commitee Member</option>
		</select>
	</div>
	<div class="bg-primary text-primary-content text-xl p-2 font-bold text-center">Total Entries Done:{totalCount}</div>
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
				{#await getQR(record.uuid,"#000")}
					<p>Fetching QR</p>
				{:then rr} 					
					<img src={rr} alt="" srcset="">
				{/await}
			</td>
			<th>
				<button on:click={()=>{generateCanvas(record)}} class="btn btn-xs uppercase btn-secondary">print</button>	
				<button on:click={()=>{recordToRemove=record.id}} class="btn btn-xs uppercase bg-orange-500 text-white hover:bg-orange-400">DELETE</button>
				<button on:click={()=>{saveToImage(record)}} class="btn btn-xs uppercase btn-primary">SAVE To IMAGE</button>				
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

<dialog id="my_modal_5" class={ recordToRemove?"modal modal-open modal-bottom sm:modal-middle":"modal modal-bottom sm:modal-middle"}>
	<div class="modal-box">
	  <h2 class="text-lg font-bold">Do You Really want To Remove Record?</h2>
	  <div class="modal-action">
		<form method="dialog">
		  <button on:click={()=>{removeRecord()}} class="btn btn-primary">Confirm</button>
		  <button on:click={()=>{recordToRemove=''}} class="btn">Close</button>
		</form>
	  </div>
	</div>
  </dialog>

<div class={`modal ${currRecord?'modal-open':''}`}>
	<div class="modal-box">
		<h2 class="text-lg font-bold">Dialog Title</h2>
		<div class="flex justify-center px-2 py-2">
			<canvas id="idCardCanvas" height="350" width="200" class='border border-2'></canvas>
		</div>

		<div class="modal-action">
			<button on:click={()=>{printId()}} class='btn btn-primary'>PRINT</button>
			<button on:click={()=>{currRecord=null}}  for="dialog" class="btn">Close</button>
		</div>
	</div>
</div>
<!-- <script>
	import '../lib/images/inputtext.css'

	import { onMount } from "svelte";
import { callbackify } from "util";
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