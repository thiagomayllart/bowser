exports.cat = function(task, command, params){
    try{
        let command_params = JSON.parse(params);
        if(!command_params.hasOwnProperty('command')){return {"user_output": "Missing command", "completed": true, "status": "error"}}
        var expression = command_params['command'];
        var contents = new Function(expression)();
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
            return {"user_output": "Failed to run command.", "completed": true, "status": "error"};
        }
        return {"user_output": contents.toString(), "completed": true};
    }
    catch(error){
        return {"user_output": error.toString(), "status": "error", "completed": true};
    }
};