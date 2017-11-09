import BaseLayout from "./layouts/base.jsx"
import SwaggerSidebar from "./components/swagger-sidebar.jsx"
import Operations from "./components/operations.jsx"
import Operation from "./components/operation.jsx"
import Info from "./components/info.jsx"
import Markdown from "./components/markdown.jsx"
import SchemaSamples from "./components/samples.jsx"

export default function () {
  return {
    components: {
      BaseLayout,
      operations: Operations,
      operation: Operation,
      info: Info,
      Markdown,
      SwaggerSidebar,
      SchemaSamples
    }
  }
}
