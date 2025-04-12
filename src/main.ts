/**
 * Build: npx webpack -w
 * Release Build: npx webpack --mode=production -w
 * Server: npx live-server docs
 */

import { PreviewSection } from "./previewSection";

$(() => new PageController());

class PageController {
    constructor() {
        const previewSection = new PreviewSection();

        $(document.body).append(
            $(`<main>`).append(
                previewSection.element,
            ),
            $(`<footer>`).html(`銀河ジェネレーター Copyright (C) 2025 <a href="https://takabosoft.com/" target="_blank">Takabo Soft</a>`),
        );
    }
}