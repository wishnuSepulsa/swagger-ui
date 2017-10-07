# Plugin system overview

### Prior art

Swagger-UI leans heavily on concepts and patterns found in React and Redux.

If you aren't already familiar, here's some suggested reading:

- [React: Quick Start (reactjs.org)](https://reactjs.org/docs/hello-world.html)
- [Redux README (redux.js.org)](http://redux.js.org/)

In the following documentation, we won't take the time to define the fundamentals covered in the resources above.

> **Note**: Some of the examples in this section contain JSX, which is a syntax extension to JavaScript that is useful for writing React components.
>
> If you don't want to set up a build pipeline capable of translating JSX to JavaScript, take a look at [React without JSX (reactjs.org)](https://reactjs.org/docs/react-without-jsx.html).

### The System

The _system_ is the heart of the Swagger-UI application. At runtime, it's a JavaScript object that holds many things:

- React components
- Bound Redux actions and reducers
- Bound Reselect state selectors
- System-wide collection of available components
- Built-in helpers like `getComponent`, `makeMappedContainer`, and `getStore`
- User-defined helper functions

The system is built up when Swagger-UI is called by iterating through ("compiling") each plugin that Swagger-UI has been given, through the `presets` and `plugins` configuration options.

### Presets

Presets are arrays of plugins, which are provided to Swagger-UI through the `presets` configuration option. All plugins within presets are compiled before any plugins provided via the `plugins` configuration option. Consider the following example:

```javascript
SwaggerUI({
  presets: [
    [FirstPlugin, SecondPlugin],
    [ThirdPlugin, FourthPlugin]
  ],
  plugins: [
    FifthPlugin,
    SixthPlugin
  ]
})
```

By default, Swagger-UI includes the internal `ApisPreset`, which contains a set of plugins that provide baseline functionality for Swagger-UI. If you specify your own `presets` option, you need to add the ApisPreset manually, like so:

```javascript
SwaggerUI({
  presets: [
    SwaggerUI.presets.apis,
    MyAmazingCustomPreset
  ]
})
```

### getComponent

`getComponent` is a helper function injected into every container component, which is used to get references to components provided by the plugin system.

All components should be loaded through `getComponent`, since it allows other plugins to modify the component. It is preferred over a conventional `import` statement.

Container components in Swagger-UI can be loaded by passing `true` as the second argument to `getComponent`, like so:

```
getComponent("ContainerComponentName", true)
```

This will map the current system as props to the component.