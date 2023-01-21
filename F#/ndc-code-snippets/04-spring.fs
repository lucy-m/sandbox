type PhysicalProperties = {
  friction: double
  weight: double
}

type MovingObject = {
  position: double * double
  velocity: double * double
  properties: PhysicalProperties
}
