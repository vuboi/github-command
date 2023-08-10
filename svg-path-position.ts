import { Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[MoLibsDashboardSvgPathPositionDirective]',
  standalone: true
})
export class MoLibsDashboardSvgPathPositionDirective implements OnChanges, OnDestroy {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private translate = inject(TranslateService);

  private setTimeOutSvg!: number;

  @Input({ required: true }) config!: {
    text: string;
    classLabel: string;
    colorText?: string;
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && changes['config'].currentValue) {
      this.setTimeOutSvg = (setTimeout(() => {
        const path = this.elementRef.nativeElement;
        // Get the parent element of the old element
        const parentElement = this.renderer.parentNode(this.elementRef.nativeElement);
        // const dPath = this.elementRef.nativeElement.getAttribute('d');
        const colorText = this.elementRef.nativeElement.getAttribute('fill');
        const pathBBox = path.getBBox();
        const newElementSvg = document.createElementNS("http://www.w3.org/2000/svg", "text");

        newElementSvg.textContent = this.translate.instant(this.config.text);
        this.renderer.setAttribute(newElementSvg, "x", Math.floor(Number(pathBBox.x)).toString());
        this.renderer.setAttribute(newElementSvg, "y", Math.floor((Number(pathBBox.y) + Number(pathBBox.height))).toString());
        this.renderer.setAttribute(newElementSvg, "fill", colorText || this.config.colorText);
        this.renderer.addClass(newElementSvg, this.config.classLabel);
        // Insert the new element before the old element
        this.renderer.insertBefore(parentElement, newElementSvg, this.elementRef.nativeElement);
        // Remove the old element
        this.renderer.removeChild(parentElement, this.elementRef.nativeElement);
      }, 300) as unknown) as number;
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.setTimeOutSvg);
  }
}
