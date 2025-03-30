from mythic_container.MythicCommandBase import *
import json

class InlineJSPersistentArguments(TaskArguments):
    def __init__(self, command_line, **kwargs):
        super().__init__(command_line, **kwargs)
        self.args = [
            CommandParameter(
                name="command",
                cli_name="Command",
                display_name="JS command",
                type=ParameterType.String,
                description="JS command"),
        ]

    async def parse_arguments(self):
        if len(self.command_line) == 0:
            raise Exception("Require JS command to run.\n\tUsage: {}".format(InlineJSPersistentCommand.help_cmd))
        if self.command_line[0] == "{":
            self.load_args_from_json_string(self.command_line)
        else:
            if self.command_line[0] == '"' and self.command_line[-1] == '"':
                self.command_line = self.command_line[1:-1]
            elif self.command_line[0] == "'" and self.command_line[-1] == "'":
                self.command_line = self.command_line[1:-1]
            self.add_arg("command", self.command_line)


class InlineJSPersistentCommand(CommandBase):
    cmd = "inline_js_persistent"
    needs_admin = False
    help_cmd = ""
    description = "Run Inline JS persistently. Use 'list_inline_js_persistent' to list running tasks and 'kill_inline_js_persistent' to kill."
    version = 1
    author = "@thiagomayllart"
    argument_class = InlineJSPersistentArguments
    attackmapping = []

    async def create_tasking(self, task: MythicTask) -> MythicTask:
        task.display_params = task.args.get_arg("command")
        return task

    async def process_response(self, response: AgentResponse):
        pass
