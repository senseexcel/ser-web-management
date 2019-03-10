import { Directive, ViewContainerRef, ElementRef, TemplateRef, Input, AfterViewInit, Renderer2 } from '@angular/core';

/**
 * renders default content if ng-content not set but we want to see a default value
 *
 * @export
 * @class SmcUiNoContentDirective
 */
@Directive({ selector: '[smcUiDefaultContent]' })
export class SmcUiDefaultContentDirective implements AfterViewInit {

    private defaultTemplate: TemplateRef<any>;

    private node: HTMLElement;
    hasContent: boolean;

    constructor(
        element: ElementRef,
        private container: ViewContainerRef,
        private renderer: Renderer2
    ) {
        this.node = element.nativeElement;
    }

    @Input()
    public set smcUiDefaultContent(template: TemplateRef<any>) {
        this.defaultTemplate = template;
    }

    /**
     * content has been rendered into template
     *
     * @memberof SmcUiDefaultContentDirective
     */
    public ngAfterViewInit() {

        const childNodes = Array.from(this.node.childNodes);
        const hasContent = childNodes.some((node) => node.nodeType === 1 || node.nodeType === 3);

        if (!hasContent) {
            this.renderer.setStyle(this.node, 'display', 'none');
            window.setTimeout(() => this.container.createEmbeddedView(this.defaultTemplate) , 0);
        }
    }
}
