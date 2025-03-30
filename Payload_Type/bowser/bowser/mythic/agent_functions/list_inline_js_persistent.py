from mythic_container.MythicCommandBase import *
import json


class ListInlineJSPersistentArguments(TaskArguments):
    def __init__(self, command_line, **kwargs):
        super().__init__(command_line, **kwargs)
        self.args = []

    async def parse_arguments(self):
        if len(self.command_line) > 0:
            raise Exception("list_inline_js_persistent takes no command line arguments.")
        pass


class ListInlineJSPersistentCommand(CommandBase):
    cmd = "list_inline_js_persistent"
    needs_admin = False
    help_cmd = ""
    description = "Run Inline JS persistently. Use 'list_inline_js_persistent' to list running tasks and 'kill_inline_js_persistent' to kill."
    version = 1
    author = "@thiagomayllart"
    argument_class = ListInlineJSPersistentArguments
    attackmapping = []

    async def create_tasking(self, task: MythicTask) -> MythicTask:
        return task

    async def process_response(self, response: AgentResponse):
        pass
