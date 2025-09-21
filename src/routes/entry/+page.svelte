<script>	
import {Html5Qrcode,Html5QrcodeScanner,Html5QrcodeScanType} from "html5-qrcode"

import { onMount } from "svelte";
import {supabase} from '../../auth'
let html5QrcodeScanner,currentRecord=''
let loading=false
let mesg='',error_mesg=''

let config = {
        fps: 10,
        qrbox: {width: 250, height: 250},

        rememberLastUsedCamera: true,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA,Html5QrcodeScanType.SCAN_TYPE_FILE]
    };
    const fetchPhotoUrl=(fn)=>{
        const { data:dt } = supabase.storage.from('form-photo').getPublicUrl(fn);
        return dt.publicUrl
    }
	const fetchRecord=async(uuid1)=>{
        loading=true
        try {
            let { data: DataTble, error } = await supabase.from('DataTble')
                .select('*').eq('uuid',uuid1).single()
            currentRecord=DataTble
            error_mesg=''
        } catch (error) {
            console.log('****',error)            
            error_mesg=error
        }
        finally{
            loading=false
        }
    }
    const onScanSuccess=(decodedText, decodedResult)=>{        
            loading=true
            console.log('****',decodedResult.toString(),'****',decodedText)
            fetchRecord(decodedText)
            html5QrcodeScanner.clear()          
            html5QrcodeScanner = new Html5QrcodeScanner("reader", config,false);
            html5QrcodeScanner.render(onScanSuccess, onScanFailure);        
            loading=false
    }
	const onScanFailure=(error)=>{
        console.log('****',error)
        currentRecord=''
    }

	onMount(async()=>{
        html5QrcodeScanner = new Html5QrcodeScanner("reader", config,false);
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);        
    })
    const resetQR=()=>{
        html5QrcodeScanner.clear() 
        currentRecord=''
        html5QrcodeScanner = new Html5QrcodeScanner("reader", config,false);
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);        
    }
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
<div>
	<h1 class='bg-slate-800 text-white p-2 text-xl uppercase font-bold'>QR Code Scanner</h1>
	<div id="reader" width="800"/>
    {#if currentRecord}
        <div class="card bg-base-100 w-full md:w-1/2 mx-auto mt-4 mb-20 shadow-xl">
            <div class="bg-primary text-primary-content card-body text-center p-2">

                <h2 class="text-2xl p-2 font-bold text-center">{currentRecord.name}</h2>
                <p class="text-xl text-center">{currentRecord.contact}</p>
            </div>
            <figure>
                {#await fetchPhotoUrl(currentRecord.photo)}
					<p>Fetching Photo</p>
				{:then rr} 					
					<!-- svelte-ignore 
                     a11y-img-redundant-alt -->
					<img src={rr} class="w-48 h-48" alt="photo">
                {/await}
            </figure>
            <div>
                <p class="bg-primary text-primary-content w-full text-center">{currentRecord.addr}</p>                
                <p class="bg-primary text-primary-content w-full text-center">{currentRecord.city}</p>
            </div>
            <div class="my-4 flex justify-center p-2">
                <button on:click={()=>{resetQR()}} class="btn btn-primary rounded text-primary-content">Reload</button>
            </div>
        </div>        
    {/if}
</div>


