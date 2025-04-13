export const defines = `
precision highp float;
precision highp int;

uniform vec2 u_resolution;
uniform float u_cameraYRot;
uniform float u_cameraXRot;
uniform float u_cameraZRot;
uniform float u_cameraDist;

uniform int u_cloudMaxSteps;
uniform int u_fbmMaxSteps;
uniform int u_fbmMinSteps;

const float PI = 3.14159265359;
`;