export class UIUtils {

    private constructor() {

    }

    static width(container: HTMLElement): number {
        const style: CSSStyleDeclaration = window.getComputedStyle(container);
        const width: number = container.offsetWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - parseFloat(style.borderLeft) - parseFloat(style.borderRight) - parseFloat(style.marginLeft) - parseFloat(style.marginRight);
        return width
    }

}