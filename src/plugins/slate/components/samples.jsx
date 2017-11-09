import React from 'react'
import { Accordion } from 'semantic-ui-react'

const level1Panels = [
  { title: 'Request Schema', content: 'Level 1A Contents' }
]

const Level1Content = (
  <div>
    <div className='sample-content'>
      Welcome to level 1
    </div>
    <Accordion.Accordion panels={level1Panels} />
  </div>
)

const level2Panels = [
  { title: 'Response Schema', content: 'Level 2A Contents' }
]

const Level2Content = (
  <div>
    Welcome to level 2
    <Accordion.Accordion panels={level2Panels} />
  </div>
)

const rootPanels = [
  { title: 'Request Samples', content: { content: Level1Content, key: 'content-1' } },
  { title: 'Response Samples', content: { content: Level2Content, key: 'content-2' } },
]

const SchemaSamples = () => (
  <Accordion defaultActiveIndex={[0]} panels={rootPanels} inverted exclusive={false} className='schema-sample-container'/>
)

export default SchemaSamples
