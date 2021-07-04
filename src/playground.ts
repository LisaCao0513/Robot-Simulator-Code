'use strict';

import { basePlayground } from "./types";

export class Playground{

    _config : basePlayground;

    /**
     * The Playground class, constructor
     * @param {object} config playgroung's config
     * @constructor
     */
    constructor( config : basePlayground) {
        this._config = config;
    }

    /**
     * Check is X, Y are inside of the playground
     * @param  {INT}  x x-coordinate
     * @param  {INT}  y y-coordinate
     * @return {Boolean}
     */
     isOutOfPlayground(x : number, y : number) : boolean {
        if (
            (x > (this._config.startPointX + (this._config.lengthX - 1))) ||
            (x < this._config.startPointX) ||
            (y > (this._config.startPointY + (this._config.lengthY - 1))) ||
            (y < this._config.startPointY)
        ) {
            return true;
        } else
            return false;}        
}
