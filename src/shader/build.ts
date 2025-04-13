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
    vec3 from = vec3(0.0, 0.0, 5.0) * rotateX(u_cameraXRot) * rotateY(u_cameraYRot);
    cameraOrigin = from;
    vec3 lookAt = vec3(0.0, 0.0, 0.0);
    
    vec3 forward = normalize(lookAt - from);

// 基本の right と up ベクトル（ワールド基準）
vec3 worldUp = vec3(0.0, 1.0, 0.0);
vec3 right = normalize(cross(forward, worldUp));
vec3 up = normalize(cross(right, forward));

// カメラの up をロール角で回転
mat2 roll = mat2(
    cos(u_cameraZRot), -sin(u_cameraZRot),
    sin(u_cameraZRot), cos(u_cameraZRot)
);

// ロールは right-up 平面上で回転なので 2D行列で適用
vec2 rolled = roll * vec2(dot(right, worldUp), dot(up, worldUp));
vec3 vUp = normalize(rolled.x * right + rolled.y * up);

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