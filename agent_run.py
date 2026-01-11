"""
Title: OpenHands Repo Agent Runner (Endless)
File: agent_run.py
Description: Runs an OpenHands agent against the current repo using a local OpenAI-compatible endpoint.
"""

import os
import time

from openhands.sdk import Agent, Conversation, LLM, Tool
from openhands.tools.terminal import TerminalTool
from openhands.tools.file_editor import FileEditorTool
from openhands.tools.task_tracker import TaskTrackerTool


def main():
    llm = LLM(
        model=os.getenv("LLM_MODEL"),
        api_key=os.getenv("LLM_API_KEY"),
        base_url=os.getenv("LLM_BASE_URL"),
    )

    agent = Agent(
        llm=llm,
        tools=[
            Tool(name=TerminalTool.name),
            Tool(name=FileEditorTool.name),
            Tool(name=TaskTrackerTool.name),
        ],
    )

    convo = Conversation(agent=agent, workspace=os.getcwd())

    kickoff = (
        "You are a senior software engineer working inside this repo. "
        "Rules: keep changes minimal & coherent; do NOT delete unrelated files; "
        "prefer editing existing code; run lightweight checks when possible; "
        "after each iteration, append progress notes to AGENT_LOG.md at repo root.\n\n"
        "First: inspect the repo and write a short plan in AGENT_LOG.md. "
        "Then implement the highest-leverage improvement and keep iterating."
    )

    convo.send_message(kickoff)
    convo.run()

    while True:
        convo.send_message(
            "Continue: pick the next highest-leverage task, implement it, run checks, and log progress."
        )
        convo.run()
        time.sleep(1)


if __name__ == "__main__":
    main()
