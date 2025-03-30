from mythic_container.MythicCommandBase import *
import json
from mythic_container.MythicRPC import *


class KillInlineJSPersistentArguments(TaskArguments):
    def __init__(self, command_line, **kwargs):
        super().__init__(command_line, **kwargs)
        self.args = [
            CommandParameter(
                name="task_id",
                cli_name="Task_id",
                display_name="Task Id",
                type=ParameterType.String,
                description="Task id to kill (use list_inline_js_persistent to get a list)"),
        ]

    async def parse_arguments(self):
        if len(self.command_line) == 0:
            raise Exception("Require a task id to kill.\n\tUsage: {}".format(KillInlineJSPersistentCommand.help_cmd))
        if self.command_line[0] == "{":
            self.load_args_from_json_string(self.command_line)
        else:
            if self.command_line[0] == '"' and self.command_line[-1] == '"':
                self.command_line = self.command_line[1:-1]
            elif self.command_line[0] == "'" and self.command_line[-1] == "'":
                self.command_line = self.command_line[1:-1]
            self.add_arg("command", self.command_line)


class KillInlineJSPersistentCommand(CommandBase):
    cmd = "kill_inline_js_persistent"
    needs_admin = False
    help_cmd = ""
    description = "Kill running Inline JS task. Use 'list_inline_js_persistent' to list running tasks."
    version = 1
    author = "@thiagomayllart"
    argument_class = KillInlineJSPersistentArguments
    attackmapping = []

    async def create_tasking(self, task: MythicTask) -> MythicTask:
        task.display_params = task.args.get_arg("task_id")
        return task

    async def process_response(self, response: AgentResponse):
        pass
