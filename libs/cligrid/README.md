# @pompidup/cligrid

![npm](https://img.shields.io/npm/v/@pompidup/cligrid)
![license](https://img.shields.io/npm/l/@pompidup/cligrid)
![build](https://img.shields.io/github/actions/workflow/status/pompidup/cligrid/build.yml)

Changelog is available [here](https://github.com/Pompidup/KDominoMonoRepo/blob/main/libs/cligrid/CHANGELOG.md).

Illustration of the library in action ![](https://github.com/Pompidup/KDominoMonoRepo/blob/main/libs/cligrid/assets/cligrid.gif)

# CliGrid Library

CliGrid is a powerful library designed to provide a flexible and extensible system for managing and rendering terminal user interfaces. Built with scalability and customization in mind, CliGrid allows developers to create intricate terminal-based applications with ease.

## Features

Dynamic Terminal Dimensions: Automatically adjusts layout based on terminal size changes.

Component-Based Architecture: Structure your terminal UI with reusable and customizable components.

Real-Time Rendering: Efficiently update only the parts of the UI that change to enhance performance.

Event-Driven Component Interaction: Listen and respond to changes in component properties seamlessly.

## Installation

To include CliGrid in your project, install the library using npm:

You can install `@pompidup/cligrid` using:

```sh
npm install @pompidup/cligrid
yarn add @pompidup/cligrid
pnpm add @pompidup/cligrid
```

## Usage

CliGrid provides a flexible way to build terminal interfaces using different layout configurations. Below are several examples demonstrating how to use various options like positions, margins, and relative placements.

### Basic Example

```typescript
import { Renderer, Template, Component } from "@pompidup/cligrid";

class GreetingComponent extends Component {
  render() {
    return "Hello, World!";
  }
}

const greetingComponent = new GreetingComponent(
  "greeting1", // Unique identifier
  "GreetingComponent", // Component name
  { x: { position: 0 }, y: { position: 0 } }, // Fixed position (left, top)
  { value: 30, unit: "%" }, // Width as a percentage
  { value: 10, unit: "%" }, // Height as a percentage
  {} // Initial props
  1, // Margin is optional default value is 1
);

const template = new Template();
template.addComponent(greetingComponent);

const renderer = new Renderer(template);
renderer.render();
```

### Relative Positioning

```typescript
import { Renderer, Template, Component } from "@pompidup/cligrid";

class StatusComponent extends Component<{
  status: string;
}> {
  render() {
    return `Status: ${this.props.status}`;
  }
}

const greetingComponent = new GreetingComponent(
  "greeting1",
  "GreetingComponent",
  { x: { position: 0 }, y: { position: 0 } },
  { value: 30, unit: "%" },
  { value: 10, unit: "%" },
  {}
);

const statusComponent = new StatusComponent(
  "status1",
  "StatusComponent",
  {
    x: { position: "right", relativeTo: "greeting1" },
    y: { position: 0 },
  }, // Relative positioning
  { value: 70, unit: "%" },
  { value: 10, unit: "%" },
  { status: "Online" }
);

const template = new Template();
template.addComponent(greetingComponent);
template.addComponent(statusComponent);

const renderer = new Renderer(template);
renderer.render();
```

### Full example

For generating a full grid with multiple components and visualizing separate components, you can use custom inmplementations in render method or use library like [boxen](https://www.npmjs.com/package/boxen).

```typescript
import { Renderer, Template, Component } from "@pompidup/cligrid";

class HeaderComponent extends Component {
  render() {
    const { width, height } = this.getActualDimensions(
      process.stdout.columns,
      process.stdout.rows
    ); // Retrieve actual dimensions of component based on terminal size
    return boxen("Header Section", {
      borderColor: "green",
      borderStyle: "double",
      width: width - this.margin * 2,
      height: height - this.margin * 2,
    });
  }
}

class MenuComponent extends Component {
  render() {
    const { width, height } = this.getActualDimensions(
      process.stdout.columns,
      process.stdout.rows
    );
    return boxen("Menu Section", {
      borderColor: "green",
      borderStyle: "double",
      width: width - this.margin * 2,
      height: height - this.margin * 2,
    });
  }
}

class ContentComponent extends Component<{
  content: string;
}> {
  render() {
    const { width, height } = this.getActualDimensions(
      process.stdout.columns,
      process.stdout.rows
    );
    return boxen(this.props.content, {
      borderColor: "green",
      borderStyle: "double",
      width: width - this.margin * 2,
      height: height - this.margin * 2,
    });
  }
}

class FooterComponent extends Component {
  render() {
    const { width, height } = this.getActualDimensions(
      process.stdout.columns,
      process.stdout.rows
    );
    return boxen("Footer Section", {
      borderColor: "green",
      borderStyle: "double",
      width: width - this.margin * 2,
      height: height - this.margin * 2,
    });
  }
}

const menuComponent = new MenuComponent(
  "menu1",
  "MenuComponent",
  { x: { position: 0 }, y: { position: 0 } }
  { value: 20, unit: "%" },
  { value: 80, unit: "%" },
  {}
);

const headerComponent = new HeaderComponent(
  "header1",
  "HeaderComponent",
  { x: { position: "right", relativeTo: "menu1" }, y: { position: 0 } },
  { value: 80, unit: "%" },
  { value: 20, unit: "%" },
  {}
);

const content1Component = new ContentComponent(
  "content1",
  "ContentComponent",
  { x: { position: "right", relativeTo: "menu1" }, y: { position: "bottom", relativeTo: "header1" } },
  { value: 40, unit: "%" },
  { value: 60, unit: "%" },
  { content: "Content 1" }
);

const content2Component = new ContentComponent(
  "content2",
  "ContentComponent",
  { x: { position: "right", relativeTo: "content1" }, y: { position: "bottom", relativeTo: "header1" } },
  { value: 40, unit: "%" },
  { value: 60, unit: "%" },
  { content: "Content 2" }
);

const footerComponent = new FooterComponent(
  "footer1",
  "FooterComponent",
  { x: { position: 0 }, y: { position: "bottom", relativeTo: "content2" } },
  { value: 100, unit: "%" },
  { value: 20, unit: "%" },
  {}
);

const template = new Template();
template.addComponent(menuComponent);
template.addComponent(headerComponent);
template.addComponent(content1Component);
template.addComponent(content2Component);
template.addComponent(footerComponent);

const renderer = new Renderer(template);

// Initialize first render
renderer.render();
```

### Partial Rendering

```typescript
import { Renderer, Template, Component } from "@pompidup/cligrid";

class ContentComponent extends Component<{
  content: string;
}> {
  render() {
    return this.props.content;
  }
}

class StatusComponent extends Component<{
  status: string;
}> {
  render() {
    return `Status: ${this.props.status}`;
  }
}

const contentComponent = new ContentComponent(
  "content1",
  "ContentComponent",
  { x: { position: 0 }, y: { position: 0 } },
  { value: 30, unit: "%" },
  { value: 10, unit: "%" },
  {}
);

const statusComponent = new StatusComponent(
  "status1",
  "StatusComponent",
  {
    x: { position: "right", relativeTo: "content1" },
    y: { position: 0 },
  },
  { value: 70, unit: "%" },
  { value: 10, unit: "%" },
  { status: "Online" }
);

const template = new Template();
template.addComponent(contentComponent);
template.addComponent(statusComponent);

const renderer = new Renderer(template);

// Initialize first render
renderer.render();

// Update content
contentComponent.setProps({ content: "New Content" });
// A partial render is triggered to update only the content component when props are changed
```

### Rezising automatically

When terminal size changes, CliGrid automatically adjusts the layout to accommodate the new dimensions. This ensures that the UI remains responsive and adapts to the available space.

## Key Components

- Template: Manages the layout and contains the components to be rendered.

- Renderer: Responsible for rendering the UI components and responding to terminal size changes.

- Component: The basic building block for creating UI elements with customizable properties.

## Contribution

Contributions to CliGrid are welcome! If you have ideas or improvements, please feel free to open issues or submit pull requests on our GitHub repository.

## License

CliGrid is released under the MIT License.
