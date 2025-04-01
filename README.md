# Bowser

Bowser is a browser-based JavaScript payload that connects to a Mythic instance and enables remote command execution across connected tabs. Unlike traditional agents, Bowser runs directly within the browser and leverages local storage to persist its connection credentials (such as UUIDs, keys, etc.), ensuring the session remains active even if the user closes and later reopens the tab.

## Overview

Bowser operates by executing JavaScript directly in the browser. It stores persistent connection information in the browser’s local storage so that if the same tab is reopened, the agent will re-establish its connection without requiring re-authentication. This functionality makes Bowser ideal for scenarios where you need a resilient browser-based C2 channel.

* inline_js_persistent: Continuously executes a JavaScript snippet on the page at regular intervals.
* inline_js: Executes a one-time JavaScript command.
* kill_inline_js_persistent: Terminates a persistent JavaScript execution.
* list_inline_js_persistent: Lists all currently running persistent JavaScript commands.

## How to Install Bowser Within Mythic

Bowser is installed into your Mythic instance using the mythic-cli binary:

## How Bowser Works
Bowser is unique in that it runs entirely in the browser. Once installed, the agent performs the following tasks:

1. Persistent Connection:
Upon loading, Bowser retrieves its connection data (UUID, cryptographic keys, etc.) from local storage. This persistence allows the agent to re-establish its session even if the browser tab is closed and later reopened.

2. Command Execution:

- inline_js_persistent: Continuously runs a specified JavaScript snippet, enabling ongoing monitoring or repeated tasks.

- inline_js: Executes a JavaScript snippet once, ideal for single-shot commands.

- kill_inline_js_persistent: Stops a persistent execution, giving you control over long-running scripts.

- list_inline_js_persistent: Provides an overview of all active persistent JavaScript executions.

3. Integration with Mythic:
Bowser connects to your Mythic instance, allowing operators to issue remote commands directly to the browser environment. It is designed to work in conjunction with complementary projects such as Blender, which extends its capabilities in browser-based C2 operations.

## Integration with Blender
Bowser is intended to be used alongside the Blender project: https://github.com/thiagomayllart/blender. While Bowser handles the persistent browser connection and command execution, Blender provides additional tools for managing browser-based sessions. You can also integrate Bowser with any tool capable of injecting Javascripts.
