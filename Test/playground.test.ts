import { Playground } from "../src/playground";
import { Config } from "../src/config";

describe("Playground testing", ()=>{
    let playground : Playground;
    let config = new Config();

    let xOuts : number[] = [config.playground.startPointX - 1, config.playground.lengthX],
        yOuts : number[] = [config.playground.startPointY - 1, config.playground.lengthY],
        yIns : number[] = [config.playground.startPointY, config.playground.lengthY - 1],
        xIns : number[] = [config.playground.startPointX, config.playground.lengthX - 1];

    beforeAll(() => {
        playground = new Playground(config.playground);
    });

    function loopInvalidY(x:number, y:number) {
        test('shoud return TRUE if Ys are OUTSIDE it', () => {
            expect(playground.isOutOfPlayground(x, y)).toBe(true);
        });
    }

    function loopValidY(x:number, y:number) {
        test('shoud return FALSE if Ys are INSIDE it', () => {
            expect(playground.isOutOfPlayground(x, y)).toBe(false);
        });
    }

    function loopInvalidX(x:number, y:number) {
        test('shoud return TRUE if Xs are OUTSIDE it', () => {
            expect(playground.isOutOfPlayground(x, y)).toBe(true);
        });
    }

    function loopValidX(x:number, y:number) {
        test('shoud return FALSE if Xs are INSIDE it', () => {
            expect(playground.isOutOfPlayground(x, y)).toBe(false);
        });
    }

    /**
     * Y is OUTside
     */
         for (var x = config.playground.startPointX; x < config.playground.lengthX; ++x) {
            for (var i = 0; i < yOuts.length; ++i) {
                loopInvalidY(x, yOuts[i]);
            }
        }
    
        /**
         * Y is INside
         */
        for (var x = config.playground.startPointX; x < config.playground.lengthX; ++x) {
            for (var i = 0; i < yIns.length; ++i) {
                loopValidY(x, yIns[i]);
            }
        }
    
        /**
         * X is OUTside
         */
        for (var y = config.playground.startPointY; y < config.playground.lengthY; ++y) {
            for (var i = 0; i < xOuts.length; ++i) {
                loopInvalidX(xOuts[i], y);
            }
        }
    
        /**
         * X is INside
         */
        for (var y = config.playground.startPointY; y < config.playground.lengthY; ++y) {
            for (var i = 0; i < xIns.length; ++i) {
                loopValidX(xIns[i], y);
            }
        }
    




})