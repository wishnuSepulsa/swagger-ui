import StandaloneLayout from "./layout"
import TopbarPlugin from "plugins/topbar"
import ConfigsPlugin from "plugins/configs"
import BaseLayoutPlugin from "plugins/slate"

// the Standalone preset

let preset = [
  //TopbarPlugin,
  ConfigsPlugin,
  BaseLayoutPlugin,
  () => {
    return {
      components: { StandaloneLayout }
    }
  }
]

module.exports = preset
