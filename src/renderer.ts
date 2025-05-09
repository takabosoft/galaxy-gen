import { WebGLCanvas } from "./common/webGLCanvas";
import { buildFragmentShader } from "./shader/build";

export interface RendererParams {
    readonly cameraYRot: number;
    readonly cameraXRot: number;
    readonly cameraZRot: number;
    readonly cameraDist: number;
    readonly galaxyRadius: number;
    readonly galaxyHeight: number;
    readonly armAlpha: number;
    readonly armWidth: number;
    readonly arms: number;
    readonly spiralStrength: number;
    readonly armDistortion: number;
    readonly stickRadius: number;
    readonly cloudMaxSteps: number;
    readonly fbmMaxSteps: number;
    readonly fbmMinSteps: number;
}

interface Uniform1fInfo {
    readonly name: string;
    readonly getValue: (params: RendererParams) => number;
    location?: WebGLUniformLocation | null;
}

interface Uniform1iInfo {
    readonly name: string;
    readonly getValue: (params: RendererParams) => number;
    location?: WebGLUniformLocation | null;
}

export class Renderer {
    readonly webGlCanvas: WebGLCanvas;
    private readonly uniform1fInfos: readonly Uniform1fInfo[] = [
        { name: "u_cameraYRot", getValue: p => p.cameraYRot },
        { name: "u_cameraXRot", getValue: p => p.cameraXRot },
        { name: "u_cameraZRot", getValue: p => p.cameraZRot },
        { name: "u_cameraDist", getValue: p => p.cameraDist },
        { name: "u_galaxyRadius", getValue: p => p.galaxyRadius },
        { name: "u_galaxyHeight", getValue: p => p.galaxyHeight },
        { name: "u_armAlpha", getValue: p => p.armAlpha },
        { name: "u_armWidth", getValue: p => p.armWidth },
        { name: "u_arms", getValue: p => p.arms },
        { name: "u_spiralStrength", getValue: p => p.spiralStrength },
        { name: "u_armDistortion", getValue: p => p.armDistortion },
        { name: "u_stickRadius", getValue: p => p.stickRadius },
    ];
    private readonly uniform1iInfos: readonly Uniform1iInfo[] = [
        { name: "u_cloudMaxSteps", getValue: p => p.cloudMaxSteps },
        { name: "u_fbmMaxSteps", getValue: p => p.fbmMaxSteps },
        { name: "u_fbmMinSteps", getValue: p => p.fbmMinSteps },
    ];

    constructor(
        width: number, 
        height: number,
    ) {
        this.webGlCanvas = new WebGLCanvas(width, height, buildFragmentShader());
        this.setupUniformLocations();
    }

    private setupUniformLocations() {
        this.uniform1fInfos.forEach(info => info.location = this.webGlCanvas.getUniformLocation(info.name));
        this.uniform1iInfos.forEach(info => info.location = this.webGlCanvas.getUniformLocation(info.name));
    }

    render(params: RendererParams): void {
        if (this.webGlCanvas.isContextLost) {
            this.webGlCanvas.setupWebGL();
            this.setupUniformLocations();
        }

        this.uniform1fInfos.forEach(info => this.webGlCanvas.uniform1f(info.location!, info.getValue(params)));
        this.uniform1iInfos.forEach(info => this.webGlCanvas.uniform1i(info.location!, info.getValue(params)));
      
        this.webGlCanvas.render();
    }
}