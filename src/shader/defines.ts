export const defines = `
precision highp float;
precision highp int;

uniform vec2 u_resolution;
uniform float u_cameraYRot;
uniform float u_cameraXRot;
uniform float u_cameraZRot;
uniform float u_cameraDist;
uniform float u_galaxyRadius;
uniform float u_galaxyHeight;
uniform float u_armAlpha;
uniform float u_armWidth;
uniform float u_arms;
uniform float u_stickRadius;
uniform float u_spiralStrength;

uniform int u_cloudMaxSteps;
uniform int u_fbmMaxSteps;
uniform int u_fbmMinSteps;

const float PI = 3.14159265359;
`;