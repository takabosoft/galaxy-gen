import { camera } from "./camera";
import { defines } from "./defines";
import { galaxy } from "./galaxy";
import { matrix } from "./matrix";
import { ray } from "./ray";
import { simplexNoise } from "./simplexNoise";
import { smoothMinMax } from "./smoothMinMax";

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
${smoothMinMax}
${camera}
${galaxy}

void main() {
    cameraOrigin = vec3(sin(u_cameraYRot) * 5.0, +2.0, cos(u_cameraYRot) * 5.0);
    vec3 lookAt = vec3(0.0, 0.0, 0.0);
    vec3 vUp = vec3(0.0, 1.0, 0.0) * rotateY(-u_cameraYRot * 0.1);
    Ray ray = cameraGetRay(cameraOrigin, lookAt, vUp, 90.0);

    float brightness = 0.0;
    float n = snoise(ray.direction * 100.0);
    brightness = smoothstep(0.7, 1.0, n);
    vec4 col = getGalaxy(ray);
    if (brightness > 0.0 && col.a < 1.0) {
        col = mix(vec4(blackBodyColor(0.1 + brightness * 0.3), brightness), col, col.a);
    }

    gl_FragColor = vec4(mix(vec3(0.0), col.rgb, col.a), 1.0);
}
`;
}