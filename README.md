# 🤖 ShoppingAgent 🛒



> 🎥 Watch **ShoppingAgent** in action!

---

## Table of Contents

- [Introduction](#introduction)
- [Architecture Diagram](#architecture-diagram)
- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Application Workflow](#application-workflow)
- [Screenshots](#screenshots)
- [AI-Assisted Development](#ai-assisted-development)
- [Google Skills Lab Reference](#google-skills-lab-reference)
- [Future Enhancements](#future-enhancements)
- [Resources](#resources)
- [Disclaimer](#disclaimer)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Introduction

**ShoppingAgent** is an AI-powered Party Planner Shopping Agent that helps users turn event-planning requirements into a curated and budget-conscious shopping plan.

Instead of manually planning items, quantities, and shopping requirements for a party or event, users can interact with the AI agent using natural language and receive recommendations tailored to their event.

The application is designed to help users:

- Define their party or event requirements.
- Plan shopping needs based on the number of guests.
- Generate a curated shopping list.
- Consider budget constraints.
- Refine and modify shopping plans through conversation.
- Get item substitutions when required.
- Optimize shopping choices based on user requirements.

The project was initially created as part of the **Create a Shopping Agent with Google AI Studio** Google Skills lab and was subsequently enhanced with additional functionality, refinements, and experimentation.

---

## Architecture Diagram

The following diagram illustrates the high-level architecture of **ShoppingAgent**, including the user's browser, the ShoppingAgent application, the Express backend, Gemini, and the Google AI Studio development environment.

<img width="286" height="874" alt="Architecture Diagram drawio" src="https://github.com/user-attachments/assets/c116e345-f79c-46ee-82d3-65eb28b009aa" />

### Architecture Overview

1. **User Browser**
   - Provides the web interface for interacting with ShoppingAgent.
   - Allows users to describe their party or shopping requirements.
   - Displays generated shopping plans, recommendations, and agent responses.

2. **ShoppingAgent Frontend**
   - Provides the interactive user interface.
   - Handles party-planning inputs and shopping-list interactions.
   - Communicates with the backend API.

3. **Express Backend**
   - Provides server-side API endpoints used by the application.
   - Handles requests from the frontend.
   - Communicates with Gemini for AI-powered functionality.
   - Keeps the Gemini API key on the server side.

4. **Gemini**
   - Provides AI model inference.
   - Understands natural-language party-planning requests.
   - Generates shopping recommendations and agent responses.
   - Helps refine and optimize shopping plans.

5. **Google AI Studio**
   - Used during the development and experimentation of the application.
   - Provides the environment used to build and iterate on the AI-powered application.

---

## Project Structure

```text
ShoppingAgent/
│
├── src/
│   ├── components/
│   │   └── ...
│   │
│   ├── data/
│   │   └── templates.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── .env.example
├── .gitignore
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
├── index.html
├── metadata.json
├── package.json
├── server.ts
├── tsconfig.json
└── vite.config.ts
```

> [!NOTE]
> The project structure may evolve as new features and improvements are added.

---

## Features

   - **AI-Powered Party Planning:** Use natural language to describe an event and receive an AI-generated shopping plan.
   - **Gemini-Powered Agent:** Uses Gemini to understand user requirements and generate useful recommendations.
   - **Natural-Language Interaction:** Users can interact with the agent conversationally instead of manually building a shopping plan.
   - **Party Planning:** Supports planning for different types of parties and events.
   - **Guest-Based Planning:** Uses guest information to help determine appropriate shopping requirements.
   - **Budget-Aware Recommendations:** Helps users plan shopping requirements around a specified budget.
   - **Shopping List Generation:** Generates a structured list of items required for the planned event.
   - **Shopping List Refinement:** Allows users to modify and refine the generated shopping plan.
   - **Budget Optimization:** Supports requests to reduce or optimize the planned shopping budget.
   - **Item Substitutions:** Provides alternative item suggestions when substitutions are required.
   - **Price Comparison & Optimization:** Supports shopping optimization based on available item and pricing information.
   - **Dietary Considerations:** Supports user-provided dietary requirements and restrictions.
   - **Conversational Agent:** Allows users to continue refining their plan through follow-up requests.
   - **Voice Interaction:** Supports voice-based interaction where available.
   - **Responsive Interface:** Provides an interactive interface designed for different screen sizes.
   - **Server-Side API Integration:** Keeps Gemini API communication on the backend rather than exposing the API key in the frontend.
   - **Error Handling:** Provides fallback handling for unsuccessful or unexpected AI/API responses.

---

## Tech Stack

| Technology           | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| **React**            | Frontend user interface                        |
| **TypeScript**       | Application development                        |
| **Vite**             | Frontend build and development tooling         |
| **Node.js**          | Backend runtime                                |
| **Express**          | Backend API server                             |
| **Gemini**           | LLM inference and AI agent functionality       |
| **Google AI Studio** | AI application development and experimentation |
| **HTML5**            | Application structure                          |
| **CSS**              | Styling and responsive interface               |
| **Git**              | Version control                                |
| **GitHub**           | Source code hosting                            |

---

## Application Workflow

**ShoppingAgent** follows a conversational AI workflow for transforming party-planning requirements into a shopping plan.

1️⃣ **User Request**

   - The user opens ShoppingAgent and describes the event or party they are planning.
   - Example:

     ```bash
     I'm planning a birthday party for 20 people with a budget of $300.
     ```

     The user can provide information such as:
     - Party or event type.
     - Number of guests.
     - Budget.
     - Dietary requirements.
     - Shopping preferences.
     - Other event-specific requirements.

2️⃣ **Agent Understanding**

   - The agent interprets the user's request and identifies the information required to create an appropriate shopping plan.

3️⃣ **Party Planning**

   - The agent considers the event type, guest count, budget, and other user requirements to determine the shopping needs.

4️⃣ **Shopping Plan Generation**

   - The agent generates a curated shopping plan based on the available information.
   - The plan may include:
     - Items
     - Quantities
     - Categories
     - Estimated costs
     - Shopping recommendations

5️⃣ **Budget Analysis**

   - The agent considers the user's budget and identifies opportunities to keep the shopping plan within the desired spending range.

6️⃣ **Shopping List Review**

   - The generated shopping list is presented to the user for review.

7️⃣ **Plan Refinement**

   - The user can continue the conversation and request changes.
   - Examples:

   ```bash
   Reduce the budget to $250.
   ```

   ```bash
   Add vegetarian options.
   ```

   ```bash
   Replace the chips with another snack.
   ```

8️⃣ **Item Substitution**

   When required, the agent can suggest alternative items based on the user's preferences or constraints.

9️⃣ **Shopping Optimization**

   The agent can help optimize the shopping plan based on budget, item selection, quantities, and user requirements.

🔟 **Final Shopping Plan**

   The agent returns the refined shopping plan so the user can use it as a guide for purchasing items for the event.

---

## Screenshots

### ShoppingAgent Interface



### Party Planning



### Generated Shopping Plan



### Shopping List Refinement



### Budget Optimization



### Item Substitution



### AI Agent Conversation



---

## AI-Assisted Development

**ShoppingAgent** was developed with the assistance of AI tools during the development process.

AI assistance was used to support areas such as:
- AI agent development.
- Google AI Studio application development.
- Prompt and instruction design.
- User interface development.
- Shopping workflow design.
- Party-planning workflow design.
- Gemini integration.
- Feature implementation.
- Debugging and troubleshooting.
- Testing and refinement.
- Documentation and development guidance.

AI-generated suggestions and code were reviewed, modified, integrated, tested, and adapted as part of the development process.

The final project reflects the implemented ShoppingAgent functionality, user experience, AI interaction workflow, and subsequent enhancements made during development.

---

## Google Skills Lab Reference

This project was initially developed using the Google Skills lab:

[Create a Shopping Agent with Google AI Studio](https://www.skills.google/focuses/153957?catalog_rank=%7B%22rank%22%3A3%2C%22num_filters%22%3A0%2C%22has_search%22%3Atrue%7D&parent=catalog&search_id=93858662)

The lab provided the foundation for creating an AI-powered shopping agent and exploring the development workflow using Google AI Studio.

The project was subsequently modified and enhanced beyond the initial lab implementation.

> [!NOTE]
> The Google Skills lab served as the starting point for the project. The current ShoppingAgent implementation includes additional changes, refinements, and experimentation beyond the original lab workflow.

---

## Future Enhancements

The following improvements could be considered in future iterations of **ShoppingAgent**:

- **Expanded Shopping Sources:** Support additional shopping sources and retailers.
- **Real-Time Pricing:** Integrate reliable real-time product pricing.
- **Product Availability:** Consider product availability when generating recommendations.
- **Location-Aware Shopping:** Provide recommendations based on the user's location.
- **Advanced Budget Optimization:** Improve cost optimization across the complete shopping list.
- **Shopping Cart Integration:** Allow users to transfer recommended items into supported shopping carts.
- **Persistent Shopping Lists:** Allow users to save and manage shopping plans across sessions.
- **Improved Conversation Memory:** Provide better contextual memory for longer planning conversations.
- **Advanced Dietary Support:** Improve handling of dietary preferences, allergies, and restrictions.
- **Event Templates:** Add predefined planning templates for different event types.
- **Personalized Recommendations:** Learn from user preferences to improve future shopping plans.
- **Evaluation Framework:** Add structured evaluation cases for agent accuracy, relevance, and response quality.
- **Observability:** Add improved logging, monitoring, and tracing for AI and API performance.

--- 

## Resources

[![Google AI Studio](https://img.shields.io/badge/Google%20AI%20Studio-Documentation-4285F4?logo=google)](https://ai.google.dev/aistudio)
[![Gemini](https://img.shields.io/badge/Gemini-Documentation-8E75B2?logo=google)](https://ai.google.dev/)
[![Google AI](https://img.shields.io/badge/Google%20AI-Documentation-4285F4?logo=google)](https://ai.google.dev/)
[![Google Skills](https://img.shields.io/badge/Google%20Skills-Labs-4285F4?logo=google)](https://www.skills.google/)
[![React](https://img.shields.io/badge/React-Documentation-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Documentation-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Documentation-646CFF?logo=vite)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Documentation-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-Documentation-000000?logo=express)](https://expressjs.com/)

---

## Disclaimer

**ShoppingAgent** is an AI-powered application developed for learning, experimentation, and demonstration purposes.

The project uses third-party services including **Google AI Studio**, **Gemini**, and other technologies and services used by the application. Their availability, functionality, usage limits, pricing, and applicable policies are subject to the respective providers' terms and documentation.

AI-generated shopping recommendations, estimated costs, quantities, substitutions, and other responses may contain errors or omissions. Users should independently verify recommendations, prices, product availability, dietary suitability, and other relevant information before making purchasing decisions.

The project is provided "as is" without warranties of any kind, to the extent permitted by applicable law.

---

## Contributing

Contributions are welcome. Before submitting changes, please review:

- [Contributing Guide](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security Policy](./SECURITY.md)

---

## License

This project is licensed under the **Apache License 2.0**.

See the [**LICENSE**](./LICENSE) file for details.

---

## Author

[**Sahil Sharma**](https://github.com/sahil-me)

Thank you for exploring **ShoppingAgent**. If you found the project useful, consider giving the repository a ⭐ to show your support.

