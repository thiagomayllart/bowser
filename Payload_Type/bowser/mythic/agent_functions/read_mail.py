from mythic_payloadtype_container.MythicCommandBase import *
import json
from mythic_payloadtype_container.MythicRPC import *


class ReadMailArguments(TaskArguments):
    def __init__(self, command_line, **kwargs):
        super().__init__(command_line, **kwargs)
        self.args = [
            CommandParameter(
                name="thread_id",
                cli_name="thread_id",
                display_name="Thread ID",
                type=ParameterType.String,
                description="Thread ID of the target E-mail"),
        ]

    async def parse_arguments(self):
        if len(self.command_line) == 0:
            raise Exception("Require thread_id to run.\n\tUsage: {}".format(ReadMailCommand.help_cmd))
        if self.command_line[0] == "{":
            self.load_args_from_json_string(self.command_line)
        else:
            if self.command_line[0] == '"' and self.command_line[-1] == '"':
                self.command_line = self.command_line[1:-1]
            elif self.command_line[0] == "'" and self.command_line[-1] == "'":
                self.command_line = self.command_line[1:-1]
            self.add_arg("command", self.command_line)


class ReadMailCommand(CommandBase):
    cmd = "read_mail"
    needs_admin = False
    help_cmd = ""
    description = "Read G-Suite Mail"
    version = 1
    author = "@thiagomayllart"
    argument_class = ReadMailArguments
    attackmapping = []

    async def create_tasking(self, task: MythicTask) -> MythicTask:
        task.display_params = task.args.get_arg("thread_id")
        return task

    async def process_response(self, response: AgentResponse):
        pass
