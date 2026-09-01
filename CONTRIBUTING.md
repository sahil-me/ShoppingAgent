<!---
Copyright 2026 Sahíl Sharma. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# Contribute to ShoppingAgent

Everyone is welcome to contribute, and we value every contribution. Code contributions are not the only way to support the project. Improving AI agent behavior, party planning, shopping recommendations, budget optimization, user experience, performance, security, testing, or documentation are all valuable ways to contribute to **ShoppingAgent**.

ShoppingAgent is an AI-powered Party Planner Shopping Agent that helps users create, refine, and optimize shopping plans for events and gatherings.

The project was initially created using the **Create a Shopping Agent with Google AI Studio** Google Skills lab and was subsequently enhanced with additional features and improvements.

If you find this project helpful, consider sharing it with others, referencing it in your projects, discussing it with the community, or simply giving the repository a ⭐️ to support the project.

**However you choose to contribute, please be mindful and respect our [Code of Conduct](https://github.com/sahil-me/ShoppingAgent/blob/main/CODE_OF_CONDUCT.md).**

## Ways to contribute

There are several ways you can contribute to **ShoppingAgent**.

* **AI Agent Improvements**: Improve the agent's ability to understand party-planning requests, reason about shopping needs, and provide clear and useful recommendations.
* **Shopping Recommendations**: Improve item recommendations, quantities, categories, store suggestions, substitutions, and shopping-list organization.
* **Party Planning**: Improve guest calculations, food and beverage planning, event-specific recommendations, preparation timelines, and party planning workflows.
* **Budget Optimization**: Improve budget calculations, cost-saving recommendations, price comparisons, and shopping strategies.
* **User Experience**: Improve the interface, navigation, responsiveness, accessibility, chatbot experience, voice interactions, and overall usability.
* **Bug Fixes**: Identify and fix bugs or unexpected behavior in the agent or supporting application code.
* **Performance Optimization**: Improve agent response time, API efficiency, resource usage, and overall application performance.
* **Security Improvements**: Help identify and address security issues related to user input, prompt injection, API access, configuration, or secrets.
* **Testing**: Add or improve tests for agent behavior, shopping recommendations, budget calculations, API functionality, and different party-planning scenarios.
* **Gemini Integration**: Improve the use of Gemini and the application's AI-powered functionality, including prompts, structured responses, and fallback behavior.
* **Documentation**: Improve the README, setup instructions, architecture documentation, troubleshooting guidance, contribution documentation, and other project documentation.

> All contributions are equally valuable to the project and community. 🥰

## Submitting a bug-related issue or feature request

At any moment, feel free to open an issue, including relevant error logs, screenshots, Node.js version, dependency versions, or other useful information when it is related to a bug.

Please check the existing issues before creating a new one. This helps avoid duplicate reports and makes it easier to track existing problems.

### Did you find a bug?

**ShoppingAgent** becomes more reliable through community feedback, issue reporting, and meaningful contributions.

Before reporting an issue, please make sure the bug has not already been reported under the repository's **Issues** section.

When submitting a bug report, please include the following information:

* Your **operating system** and version.
* Steps to reproduce the issue.
* A short description of the expected behavior and what actually happened.
* Relevant error messages or application logs.
* Node.js version and relevant dependency versions.
* Browser and version when the issue is related to the user interface.
* Screenshots or screen recordings, if applicable.
* Any other information that may help reproduce or understand the issue.

Please **do not include API keys, passwords, authentication tokens, service credentials, access tokens, or other sensitive information** in an issue.

### Do you want a new feature?

If there is a new feature you'd like to see in **ShoppingAgent**, please open an issue and describe:

1. **Motivation**  
   Explain the problem, limitation, or use case that the feature would address.

2. **Feature Description**  
   Describe the proposed feature and how you would expect it to work.

3. **Agent Behavior**  
   Explain how the feature should influence the agent's reasoning, recommendations, shopping suggestions, or responses.

4. **Shopping & Party Planning**  
   Describe how the feature would interact with shopping lists, party details, guest counts, budgets, dietary requirements, stores, or other planning workflows.

5. **Implementation Details**  
   If you have an implementation idea, architecture suggestion, or code example, feel free to include it.

6. **Additional References**  
   If the feature is inspired by an external project, article, design, lab, or technical reference, please include the relevant link.

A clear and well-written feature request makes it much easier to evaluate and discuss the proposal.

## Do you want to improve ShoppingAgent's shopping or planning workflow?

Shopping recommendations and party-planning workflows are important parts of **ShoppingAgent**.

You can contribute by:

* Improving party and event planning.
* Improving guest-count calculations.
* Improving food and beverage recommendations.
* Improving shopping-list generation.
* Improving item quantities and units.
* Improving item categories.
* Improving store recommendations.
* Improving item substitutions.
* Improving budget calculations.
* Improving price comparison and optimization.
* Improving dietary and allergen considerations.
* Improving preparation and shopping timelines.
* Improving error handling and fallback behavior.
* Improving the agent's ability to adapt recommendations to user requirements.

When modifying the shopping or planning workflow, ensure that the agent uses the information provided by the user and avoids making unsupported assumptions.

## Do you want to improve AI agent behavior?

Contributions that improve the **ShoppingAgent** behavior are especially welcome.

Examples include:

* Improving agent instructions.
* Improving party-planning reasoning.
* Improving shopping recommendations.
* Improving budget reasoning.
* Improving item substitution recommendations.
* Improving response accuracy and clarity.
* Improving structured AI responses.
* Improving error handling and fallback behavior.
* Reducing unsupported assumptions.
* Improving the agent's ability to understand user constraints.
* Adding additional safety or validation constraints.
* Improving protection against prompt-injection and other AI-specific risks.

Changes to agent behavior should be tested against representative party-planning and shopping scenarios to ensure that the agent continues to provide useful, relevant, and practical recommendations.

## Do you want to add documentation?

We're always looking for improvements that make **ShoppingAgent** clearer and easier to understand.

You can contribute by:

* Fixing typos or grammatical errors.
* Improving setup instructions.
* Adding missing documentation.
* Improving local development instructions.
* Documenting the application architecture.
* Documenting the AI agent workflow.
* Documenting Gemini integration.
* Adding examples.
* Improving troubleshooting documentation.
* Documenting available features.
* Documenting agent behavior and capabilities.
* Improving contribution guidelines.

Documentation contributions are highly appreciated, especially when they make it easier for new contributors to understand and run the project.

## Fixing outstanding issues

If you notice an existing issue and have a fix in mind, feel free to **[start contributing](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)** and open a Pull Request.

### Making code changes

<details>

1. **Fork the Repository**

   Go to the **ShoppingAgent** repository on GitHub and click the **Fork** button.

2. **Clone your forked repository**

   ```bash
   git clone https://github.com/<username>/ShoppingAgent.git
   ```

   Navigate into the project directory:

   ```bash
   cd ShoppingAgent
   ```

3. **Create a New Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Set Up the Node.js Environment**

   Make sure Node.js is installed and verify the installed version:
   
   ```bash
   node --version
   ```

   Install the project dependencies:

   ```bash
   npm install
   ```

5. **Install Dependencies**

   Install all required project dependencies:

   ```bash
   npm install
   ```

   If dependencies are updated during development, make sure the corresponding changes to `package.json` and the lock file are included in the Pull Request.

6. **Configure Gemini API Access**

   ShoppingAgent uses the Gemini API for AI-powered party planning, shopping recommendations, and agent interactions.

   Configure your Gemini API key as an environment variable:

   ```bash
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   ```

   Do not commit API keys, credentials, `.env` files containing secrets, or other sensitive information to the repository.

7. **Configure Environment Variables**

   Configure the required environment variables before running the application.

   For local development, use an appropriate environment file such as `.env.local` according to the project's configuration.

   Example:

   ```bash
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   ```

   > Never commit API keys, credentials, access tokens, or other secrets to the repository.

8. **Run ShoppingAgent Locally**

   Start the development server:

   ```bash
   npm run dev
   ```

   Open the local application using the URL provided by the development server.

9. **Make Your Changes**

   - Develop the feature or fix.
   - Follow the existing project structure and coding conventions.
   - Keep changes focused and maintainable.
   - Avoid unnecessary changes to unrelated files.
   - Preserve existing functionality where possible.
   - Test your changes locally before submitting a Pull Request.

10. **Test AI Agent and Shopping Behavior**

    If your changes affect the AI agent, shopping workflow, party planning, or budget optimization, test representative scenarios such as:

    - Creating a children's birthday party.
    - Planning a corporate event.
    - Planning an outdoor event.
    - Creating a plan for a large gathering.
    - Changing the guest count.
    - Changing the target budget.
    - Adding dietary restrictions.
    - Requesting shopping-list modifications.
    - Asking the agent to reduce the budget.
    - Requesting item substitutions.
    - Testing chatbot interactions.
    - Testing voice interactions when applicable.
    - Testing fallback behavior when Gemini is unavailable.

    Verify that the agent:

    - Understands the user's party requirements.
    - Produces relevant shopping recommendations.
    - Calculates quantities reasonably.
    - Respects the user's budget and constraints.
    - Provides useful store and substitution recommendations.
    - Returns structured responses where required.
    - Handles invalid or unexpected input appropriately.
    - Does not expose API keys or other sensitive information.

11. **Commit Your Changes**

     ```bash
     git add .
     ```

     ```bash
     git commit -m "Add feature/bugfix description"
     ```

12. **Push to Your Fork**

    ```bash
    git push origin feature/your-feature-name
    ```

13. **Create a Pull Request**

    Go to the original ShoppingAgent repository and open a New Pull Request.

    In your Pull Request description:

    - Explain what you changed.
    - Explain why the change was needed.
    - Mention any relevant issue.
    - Describe changes to agent behavior.
    - Describe changes to shopping or party-planning functionality.
    - Mention any testing performed.
    - Include screenshots or logs when appropriate.

14. **Address Feedback**

    If maintainers leave comments or request changes, address the feedback and push the required updates to your branch.
    
</details>

## Contribution Guidelines

  To keep the project maintainable and welcoming:
  - Keep Pull Requests focused on a single feature, fix, or improvement whenever possible.
  - Avoid unnecessary changes to unrelated files.
  - Follow the existing coding style and project structure.
  - Test changes before submitting a Pull Request.
  - Test AI agent behavior when modifying agent instructions or logic.
  - Test shopping and party-planning behavior when modifying recommendations or calculations.
  - Do not commit secrets, API keys, credentials, access tokens, .env files, or service-account files.
  - Do not make unsupported assumptions about party requirements, shopping needs, or user constraints.
  - Keep generated shopping recommendations practical and relevant.
  - Keep budget calculations accurate and understandable.
  - Provide clear commit messages and Pull Request descriptions.
  - Include relevant screenshots, logs, or test results when appropriate.
  - Be respectful and constructive when reviewing or discussing contributions.

## I want to become a maintainer of the project. How do I get there?

  **ShoppingAgent** is an AI-powered Party Planner Shopping Agent that uses Gemini to help users create, refine, and optimize shopping plans for events and gatherings.

  Contributors interested in improving AI agent behavior, shopping recommendations, party planning, budget optimization, Gemini integration, user experience, performance, testing, security, or documentation are always welcome.

  We are happy to welcome motivated contributors who want to take a deeper role in the project and help **ShoppingAgent** evolve into a reliable and useful AI-powered shopping assistant.

  If you are interested in contributing at a deeper level, consistently submitting meaningful improvements, reviewing Pull Requests, improving documentation, or helping maintain the project, feel free to get involved and collaborate with the community.

  Thank you for contributing to **ShoppingAgent**! 🛒🤖
