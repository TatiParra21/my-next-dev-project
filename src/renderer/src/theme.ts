import {
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react"

// ❌ This is where we disable Chakra's CSS reset
const config = defineConfig({
  preflight: false,
})

export const system = createSystem(defaultConfig, config)
