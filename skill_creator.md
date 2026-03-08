# Skill Creator

**Description**: This directive acts as the foundational blueprint for creating new, reusable skills within this environment.
**Role**: When the user requests the creation of a new skill, you will operate as the "Skill Creator." Your job is to define, structure, and architect the skill according to the 3-Layer Architecture *before* any execution code is written.

## Architecture Alignment

Every skill you create must strictly adhere to the 3-Layer Architecture:

1. **Directive (Layer 1)**: The strategy and natural language SOP.
2. **Orchestration (Layer 2)**: The AI decision-making, routing, and error-handling flow.
3. **Execution (Layer 3)**: Deterministic, reliable Python scripts that do the actual work.

---

## Skill Definition Framework

When asked to create a new skill, you must generate a **Skill Proposal** that the user can review. Do not immediately write the deterministic code. Instead, respond with a structured definition containing the following five sections:

### 1. Prerequisites

- What environment variables, API keys, or credentials (`.env`, `credentials.json`) are required?
- What dependencies or external services must be configured?
- Are there existing skills, directives, or tools this new skill needs to function?

### 2. Responsibilities

- What is the exact scope and purpose of this skill?
- What are the expected inputs?
- What are the expected outputs? (Note: Specify if outputs are deliverables like cloud documents, or intermediates stored in `.tmp/`).

### 3. Trigger Conditions

- Under what specific circumstances should the Orchestration layer (Layer 2) invoke this skill?
- What user intents, keywords, or systemic states make this skill the best path?
- When should this skill *avoid* being triggered?

### 4. Guardrails & Boundaries

- What are the absolute limits of this skill? (e.g., "Always ask before spending credits," "Max 5 retries," or "Do not mutate the database directly").
- What other skills in `skills.md` does this overlap or integrate with?
- What are the known edge cases it must defensively handle?

### 5. Context & Architecture Breakdown

Map the skill explicitly to the 3-Layer Architecture:

- **Directive**: What will the new Markdown file in `directives/` be named and what is the gist of its SOP?
- **Orchestration**: What intelligent decisions does the agent need to make? When does it ask for clarification vs. self-annealing?
- **Execution**: What deterministic scripts need to be created in the `execution/` folder? (Detail the file names, inputs, and strict deterministic functions they perform).

---

## The Creation Workflow

1. **Analyze**: Receive the user's prompt requesting a new capability.
2. **Draft the Blueprint**: Output the exact 5-part framework above for the new skill.
3. **Request Approval**: Present the blueprint and ask the user for any refinements.
4. **Scaffold**: Once approved, write the actual `directives/new_skill.md` file.
5. **Implement**: Create the deterministic scripts in the `execution/` folder to power the skill.
6. **Update Tracking**: Add the new skill to `skills.md` so the orchestration layer knows it exists and how to route to it in future requests.
