export class Color {


    private constructor(){

    }

    static rgbToHsv(r: number, g: number, b: number): { h: number, s: number, v: number } {

        r /= 255.0
        g /= 255.0
        b /= 255.0

        const max: number = Math.max(r, g, b)
        const min: number = Math.min(r, g, b)

        let h: number
        let s: number
        let v: number = max;

        const d: number = max - min
        s = max == 0 ? 0 : d / max

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6.0 : 0.0); break;
                case g: h = (b - r) / d + 2.0; break;
                case b: h = (r - g) / d + 4.0; break;
            }

            h /= 6.0;
        }

        return {
            h, s, v
        };
    }


}