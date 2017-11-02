import BaseLayout from "./layouts/base.jsx"
import SwaggerSidebar from "./components/swagger-sidebar.jsx"
import Operations from "./layouts/operations.jsx"

export default function () {
  return {
    components: {
      BaseLayout,
      operations: Operations,
      SwaggerSidebar
    }
  }
}
