export const galaxy = `
const vec3 galaxyCenter = vec3(0.0, 0.0, 0.0);
const float galaxyRadius = 3.0;
const float galaxyHeight = 0.3;
const vec3 bulgeColor = vec3(255.0 / 255.0, 187.0 / 255.0, 100.0 / 255.0); 
const float bulgeRadius = 0.5;
const float haloFalloff = 1.5;
const vec3 haloColor = vec3(1.0, 1.0, 1.0);

vec3 cameraOrigin;

float fbm(vec3 p, float scaleBase, float scalePow, float depthBase, float depthPow) {
    
    // 近いところは回数を増やしたい
    float dist = distance(cameraOrigin, p);
    int steps = int(mix(float(u_fbmMaxSteps), float(u_fbmMinSteps), clamp(dist / 20.0, 0.0, 1.0)));

    float res = 0.0;
    for (int i = 0; i < 50; i++) {
        if (i >= steps) {
            break;
        }

        float scale = scaleBase * pow(scalePow, float(i));
        float depth = depthBase * pow(depthPow, float(i));
        res += snoise(p * scale) * depth;
    }
    return res;
}

// 渦巻き共通処理
float armDist(vec3 pos, float r) {
    float angle = atan(pos.z, pos.x);
    float spiralStrength = -3.4;
    float arms = 2.0;
    float stickR = 0.0; // 棒渦巻銀河
    float r2 = stickR == 0.0 ? r : (smax(r - stickR, 0.0, 0.4));
    float spiralAngle = mod(angle - r2 * spiralStrength, 2.0 * PI);
    float armDist = abs(mod(spiralAngle * arms + PI, 2.0 * PI) - PI);
    return armDist;
}

// 明るい星たち
float getStarsDensity(vec3 worldPos) {
    vec3 pos = worldPos;// - galaxyCenter;
    
    // 高さマスク（パッツン）
    float heightMask = abs(pos.y) < (galaxyHeight * 0.5) ? 1.0 : 0.0;
    if (heightMask < 0.01) {
        return 0.0;
    }

    // 半径FBM(重い)
    float r = length(pos.xz) + fbm(pos, 0.65, 4.0, 1.0, 0.6) * 0.3;

    // 半径マスク
    float radiusMask = (1.0 - smoothstep(0.8, 1.0, r / galaxyRadius));
    if (radiusMask < 0.01) {
        return 0.0;
    }

    // 腕マスク
    float armDist = armDist(pos, r);
    float armMask = 0.5 + smoothstep(2.5, 0.0, armDist) * 0.9;

    return (snoise(pos * 100.0) * 0.5 + 0.5) * radiusMask * heightMask * armMask;
}

float getDustsDensity(vec3 worldPos) {
    vec3 pos = worldPos;// - galaxyCenter;

    // 高さマスク（パッツン）
    float heightMask = abs(pos.y) < (galaxyHeight * 0.5) ? 1.0 : 0.0;
    if (heightMask < 0.01) {
        return 0.0;
    }

    // 半径FBM(重い)
    float r = length(pos.xz) + fbm(pos, 0.65, 6.0, 1.0, 0.3) * 0.5;

    // 半径マスク
    float radiusMask = smoothstep(0.5, 0.8, r / galaxyRadius) * (1.0 - smoothstep(0.8, 1.0, r / galaxyRadius));
    if (radiusMask < 0.01) {
        return 0.0;
    }

    // 腕マスク
    float armDist = armDist(pos, r);
    float armMask = smoothstep(0.8, 0.0, armDist) * 0.9;

    return (snoise(pos * 30.0)) * radiusMask * heightMask * armMask * 6.0;
}

bool intersectSphere(vec3 rayOrigin, vec3 rayDir, vec3 sphereCenter, float sphereRadius, out float tMin, out float tMax) {
    vec3 L = rayOrigin - sphereCenter;
    float a = dot(rayDir, rayDir); // 通常1
    float b = 2.0 * dot(rayDir, L);
    float c = dot(L, L) - sphereRadius * sphereRadius;

    float discriminant = b * b - 4.0 * a * c;

    if (discriminant < 0.0) {
        return false; // 交差しない
    }

    float sqrtDiscriminant = sqrt(discriminant);
    float inv2a = 0.5 / a;

    tMin = (-b - sqrtDiscriminant) * inv2a;
    tMax = (-b + sqrtDiscriminant) * inv2a;

    return true; // 交差あり
}

// from FabriceNeyret2 shader Black Body Spectrum plank [https://www.shadertoy.com/view/4tdGWM]
vec3 blackBodyColor(float k) {
    float T = (k*2.)*16000.;
    vec3 c = vec3(1.,3.375,8.)/(exp((19e3*vec3(1.,1.5,2.)/T)) - 1.); // Planck law
    return c / max(c.r,max(c.g,c.b));  // chrominance
}

vec4 getGalaxyComponentColor(vec3 pos) {
    float distToCenter2 = length(vec3(pos.x, pos.y * 1.4, pos.z) - galaxyCenter);

    // バルジ
    float bulge = exp(-pow(distToCenter2 / bulgeRadius, 2.0)) * 1.5;

    // ハロー
    //float halo = exp(-distToCenter2 / haloFalloff) * 1.3;
    float halo = exp(-pow(distToCenter2 / haloFalloff, 1.5)) * 1.5;

    // ディスク（渦）
    float stars = getStarsDensity(pos) * 1.5;
    vec3 starsColor = blackBodyColor(clamp(0.1 + pow(stars, 2.0) * 0.4, 0.01, 1.0));

    // ダスト（渦）
    float dust = getDustsDensity(pos);

    // 合成（この場所における色とアルファを重ねる）
    vec3 color = bulgeColor * bulge + haloColor * halo + starsColor * stars;

    color = mix(color, vec3(0.2275, 0.0863, 0.0863), clamp(dust, 0.0, 1.0));
    float alpha = (bulge * 0.3 + halo * 0.09 + stars * 0.3) * 10.0 + dust;
    return vec4(color, alpha);
}

vec4 getGalaxy(Ray ray) {

    float r2 = length(vec3(galaxyRadius + 0.3, galaxyHeight / 2.0, 0));

    float tMin, tMax;
    if (!intersectSphere(ray.origin, ray.direction, galaxyCenter, r2, tMin, tMax)) {
        return vec4(0.0);
    }
    
    float stepSize = (tMax - tMin) / float(u_cloudMaxSteps);
    vec3 p = rayAt(ray, tMin);
    vec3 pStep = ray.direction * stepSize;
    vec4 finalColor = vec4(0.0);
    
    for (int i = 0; i < 1000; i++) {
        if (i >= u_cloudMaxSteps) {
            break;
        }
 
        // 各コンポーネントの色とアルファを取得
        vec4 test = getGalaxyComponentColor(p); // 例：バルジ・ハローの色など
        test.a *= stepSize;

        // 合成
        finalColor.rgb += (1.0 - finalColor.a) * test.a * test.rgb;
        finalColor.a += (1.0 - finalColor.a) * test.a;

        // 早期終了：完全に不透明なら
        if (finalColor.a > 0.99) { 
            break;
        }

        p += pStep;
    }

    return vec4(finalColor.r, finalColor.g, finalColor.b, min(finalColor.a * 1.0, 1.0));
}
`;