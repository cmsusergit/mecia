<script>
  import { onMount } from 'svelte';

  import { supabase } from '../../auth';
  import {page} from '$app/stores'
  let isOpenDlg =false;
  let selectedIndx =0,isupdate=false
  let optionList=[];

  let dtRecord={
	name:'',
	addr:'',city:'',
	
	contact:'',
	category:'',
	aadhar_number:'',	photo:'',	comment:'',other:''
} ;
	let mesg='',error_mesg=''
	let photo = null,loading=false;
    let photoURL = '';
  function confirmSelection() {
	dtRecord=selectedIndx
	isOpenDlg =false;
	isupdate=true
  }
	function validateAadhar(aadhar) {
	const regex = /^[2-9]{1}[0-9]{11}$/;
	return regex.test(aadhar);
  }
  function handlePhotoUpload(event) {
	photo = event.target.files[0];
  	photoURL = URL.createObjectURL(photo);
  }
function capturePhoto() {
	const video = document.querySelector('video');
	const canvas = document.createElement('canvas');
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	canvas.getContext('2d').drawImage(video, 0, 0);
	canvas.toBlob((blob) => {
	  photo = blob;
	  photoURL = URL.createObjectURL(photo);
	  dtRecord.photo=photoURL
	});
  }
  onMount(() => {	
	console.log('****',$page.url.searchParams.get('id'))	
	const video = document.querySelector('video');
	navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
		 video.srcObject = stream;
	});	
  });
  const fetchRecord=async(inputtext)=>{
        loading=true
        try {
            let { data: DataTble, error } = await supabase.from('DataTble')
                .select('*').eq('contact',inputtext)

			if(!DataTble || DataTble.length==0)			
			{
				alert("Record !Found")
				isupdate=false
				return
			}
			if (DataTble.length>1) {
				DataTble.forEach(rr => {
					optionList.push(rr)
				});
				isOpenDlg=true
			}
			else{
				dtRecord=DataTble[0]
				isupdate=true
			}
			if(dtRecord && dtRecord?.photo){
				photoURL=`https://ccfhpzusawtgiojavhxh.supabase.co/storage/v1/object/public/form-photo/${dtRecord?.photo}`
			}
            error_mesg=''
        } catch (error) {
            console.log('****',error)
            error_mesg=error
        }
        finally{
            loading=false
        }
    }
 const fetchByNumber=async(ee)=>{
	fetchRecord(ee.target.value)
 } 
const updateRecord=async()=>{
		try {
		loading=true
		const { data: userData, error: userError } = await supabase
		  .from('DataTble')
		  .update(dtRecord).eq('id',dtRecord.id);
		if (userError) {
		  console.error('Error saving user data:', userError.message);
		  mesg=''
		  error_mesg=userError.message
		  return;
		}
		mesg='Form submitted successfully!';
		error_mesg=''
		dtRecord={
			name:'',
			addr:'',
			city:'',
			contact:'',
			aadhar_number:'',
			photo:'',
			comment:'',other:''
		} ;

		photo=null
		photoURL=''
	  } catch (error) {
		mesg=''
		error_mesg=error.message
		console.error('An unexpected error occurred:', error.message);
	  } 
	  finally{
		loading=false
	  }		
	}
  const onsubmit=async()=>{
	try {
		if (dtRecord.id) {
			delete dtRecord.id
		}
		loading=true
		const { data: photoData, error: photoError } = await supabase.storage
		  .from('form-photo')
		  .upload(`photo/${dtRecord.name}_${Math.random()}.jpg`, photo);
		if (photoError) {
		  console.error('Error uploading photo:', photoError.message);
		  return;
		}
		dtRecord.photo=photoData.path
		const { data: userData, error: userError } = await supabase
		  .from('DataTble')
		  .insert(dtRecord);
		if (userError) {
		  console.error('Error saving user data:', userError.message);

		  mesg=''
		  error_mesg=userError.message
		  return;
		}
		mesg='Form submitted successfully!';
		error_mesg=''
		dtRecord={
			name:'',
			addr:'',city:'',
			contact:'',
			aadhar_number:'',

			photo:'',
			comment:'',other:''
		} ;

		photo=null
		photoURL=''
	  } catch (error) {
		mesg=''
		error_mesg=error.message
		console.error('An unexpected error occurred:', error.message);
	  } 
	  finally{
		loading=false
	  }
  }
</script>
<svelte:head>
	<title>Registration</title>
	<meta name="description" content="Registration" />
</svelte:head>
{#if loading}
	<div class="fixed inset-0 flex items-center justify-center bg-base-100 opacity-50 z-50">
	  <div class="loading loading-spinner text-primary w-14"></div>
	</div>
{/if}
{#if mesg}
	<div role="alert" class="toast toast-middle alert alert-success p-2">
	<span>{mesg}</span>
	<div>
		<button on:click={()=>{mesg=''}} class="btn btn-sm btn-secondary p-1">CLOSE</button>
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
<div class="container mx-auto p-4">
  	<h1 class="text-2xl font-bold mb-4">User Information Form</h1>
	<form on:submit|preventDefault={onsubmit}>
		<div class="mb-4">
		  <label class="block ml-2 font-medium mb-2" for="name1">Name</label>
		  <input type="text" bind:value={dtRecord.name} class="input input-bordered w-full" id="name1" required />
		</div>
		<div class="mb-4 flex w-full space-x-2">
			<div class="w-full">
				<label class="block ml-2 font-medium mb-2" for="contact">Contact</label>
				<input on:blur={fetchByNumber} type="contact" bind:value={dtRecord.contact} class="input input-bordered w-full" id="contact" required />
			</div>
			<div class="">
				<label class="block ml-2 font-medium mb-2 w-full" for="gendr">Category</label>	
				<select bind:value={dtRecord.category} class="w-48 input input-bordered" id="gendr" required>
					<option value="" selected disabled></option>
					<option value="MALE">MALE</option>
					<option value="FEMALE">FEMALE</option>
					<option value="SPONSOR">SPONSOR</option>
					<option value="VOLUNTEER">VOLUNTEER</option>
					<option value="TRUSTEE">TRUSTEE</option>

					<option value="Commitee Member">Commitee Member</option>

				</select>
			</div>
		</div>
		<!-- <div class="mb-4">
		  <label class="block ml-2 font-medium mb-2">Aadhaar Number</label>
		  <input type="text" bind:value={dtRecord.aadhar_number} class="input input-bordered w-full" required />
		  {#if !validateAadhar(dtRecord.aadhar_number)}	
			<p class="text-red-500 ml-2">Invalid Aadhaar number</p>
		  {/if}
		</div> -->
		<div class="mb-4">
			<label class="block ml-2 font-medium mb-2">Address</label>
			<textarea bind:value={dtRecord.addr} class="textarea textarea-bordered w-full" required></textarea>
		</div>
		<div class="mb-4">
			<label class="block ml-2 font-medium mb-2">City/Village</label>
		  	<input type="text" bind:value={dtRecord.city} class="input input-bordered w-full" required />
		</div>
		<div class={`mb-4 grid ${photoURL?'grid-cols-1 md:grid-cols-2':''}`}>			
			<div>
		  <label class="block ml-2 font-medium mb-2">Photo</label>
		  <input type="file" accept="image/*" on:change={handlePhotoUpload} class="file-input file-input-bordered w-full md:w-1/2" />
		  <video autoplay class="mt-2 w-full md:w-1/2"></video>
		  <button type="button" on:click={capturePhoto} class="btn btn-primary mt-2 md:w-1/2 w-full">Capture Photo</button>
		</div>
		<div>	
			{#if photoURL}
				<div class="mt-4">
				  <h2 class="text-xl font-bold mb-2">Uploaded/Captured Photo</h2>
				  <img src={photoURL} alt="Uploaded/Captured Photo" class="rounded-lg shadow-lg md:w-1/2 w-full" />
				</div>
			  {/if}
			</div>
		</div>
		<div class="mb-4">
			<label class="block ml-2 font-medium mb-2">Any Comment</label>
		  	<input type="text" bind:value={dtRecord.comment} class="input input-bordered w-full"/>
		</div>
		<div class="flex justify-end border border-primary shadow p-2">



		<button on:click={updateRecord} type="button" class="btn btn-secondary w-full md:w-48 p-1">Update</button>	
		<button type="submit" class="btn btn-primary w-full md:w-48 p-1">Submit</button></div>
	  </form>
</div>

{#if isOpenDlg}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Select Record</h3>
      <select bind:value={selectedIndx} class="select select-bordered w-full mt-4">
        {#each optionList as option}
          <option value={option}>{option.name}</option>
        {/each}
      </select>
      <div class="modal-action">
        <button class="btn" on:click={confirmSelection}>OK</button>
        <button class="btn btn-ghost" on:click={() => isOpenDlg =false}>Cancel</button>
      </div>
    </div>
</div>
{/if}
