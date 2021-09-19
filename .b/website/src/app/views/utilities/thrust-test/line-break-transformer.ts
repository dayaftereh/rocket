export class LineBreakTransformer {

    private container: string

    constructor() {
        this.container = ''
    }

    transform(chunk: string, controller: TransformStreamDefaultController<string>): void {
        this.container += chunk;
        const lines: string[] = this.container.split(/[\n\r|\n|\r]/g);

        const last: string | undefined = lines.pop()
        if (!!last) {
            this.container = last
        }

        lines.forEach(((line: string) => {
            controller.enqueue(line)
        }));
    }

    flush(controller: TransformStreamDefaultController<string>): void {
        controller.enqueue(this.container);
    }

}