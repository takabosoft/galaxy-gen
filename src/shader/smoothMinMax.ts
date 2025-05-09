/**
 * 引用元：https://iquilezles.org/articles/smin/
 */
export const smoothMinMax = `
float smax(float a, float b, float k) {
    float h = clamp(0.5 - 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) + k * h * (1.0 - h); 
}
`;