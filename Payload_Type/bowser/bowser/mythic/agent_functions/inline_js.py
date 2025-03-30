from mythic_container.MythicCommandBase import *
import json


class InlineJSArguments(TaskArguments):
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
            raise Exception("Require JS command to run.\n\tUsage: {}".format(InlineJSCommand.help_cmd))
        if self.command_line[0] == "{":
            self.load_args_from_json_string(self.command_line)
        else:
            if self.command_line[0] == '"' and self.command_line[-1] == '"':
                self.command_line = self.command_line[1:-1]
            elif self.command_line[0] == "'" and self.command_line[-1] == "'":
                self.command_line = self.command_line[1:-1]
            self.add_arg("command", self.command_line)


class InlineJSCommand(CommandBase):
    cmd = "inline_js"
    needs_admin = False
    help_cmd = ""
    description = "Run Inline JS"
    version = 1
    author = "@thiagomayllart"
    argument_class = InlineJSArguments
    attackmapping = []

    async def create_tasking(self, task: MythicTask) -> MythicTask:
        task.display_params = task.args.get_arg("command")
        return task

    async def process_response(self, response: AgentResponse):
        pass
