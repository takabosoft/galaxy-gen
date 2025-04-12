import { camera } from "./camera";
import { defines } from "./defines";
import { matrix } from "./matrix";
import { ray } from "./ray";
import { simplexNoise } from "./simplexNoise";

/** 
 * フラグメントシェーダーを組み立てます。
 * - 1ソースで全部やるのがしんどいので可能な範囲で分割します。
 * - 固定値を引数から変更出来るようにもできます。
 */
export function buildFragmentShader(): string {
    return `${defines}
${simplexNoise}
${ray}
${matrix}
${camera}

void main() {
    vec3 lookFrom = vec3(sin(u_cameraYRot) * 5.0, +2.0, cos(u_cameraYRot) * 5.0);
    vec3 lookAt = vec3(0.0, 0.0, 0.0);
    vec3 vUp = vec3(0.0, 1.0, 0.0) * rotateY(-u_cameraYRot * 0.1);
    Ray ray = cameraGetRay(lookFrom, lookAt, vUp, 90.0);

    float brightness = 0.0;
    float n = snoise(ray.direction * 100.0);
    brightness = smoothstep(0.7, 1.0, n);

    gl_FragColor = vec4(vec3(brightness), 1.0);
}
`;
}