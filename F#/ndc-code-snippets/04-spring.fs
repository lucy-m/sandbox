type PhysicalProperties = {
  friction: double
  weight: double
}

type MovingItem = {
  position: double * double
  velocity: double * double
  properties: PhysicalProperties
}
