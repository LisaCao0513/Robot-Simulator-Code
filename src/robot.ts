'use strict';
import { Coordinate,CoordinateInputCommands,operationData, RobotConfig } from './types';

import { Config } from './config'
import { Playground } from './playground';
import { Messenger } from './messenger';


/**
 * The robot class. Robot's constructor function.
 * The robot's dependencies are: the Playground and the Messenger instances
 * @param {object} config    robot's config
 * @param {Playground} playgroud The Playground instance
 * @param {Messenger} messenger The Messenger instance
 * @constructor
 */

export class Robot{

    _config : RobotConfig;
    _playground : Playground;
    _messenger : Messenger;
    _isFirstStepMade : boolean;
    _oCurrentPosition : Coordinate;

    constructor(config : RobotConfig, playground : Playground, messenger : Messenger){
        this._config = config;
        this._playground = playground;
        this._messenger = messenger;
        this._isFirstStepMade = false;
        this._oCurrentPosition = {
            x: undefined,
            y: undefined,
            f: undefined
        };
    }

        /**
     * To PLACE the robot
     * @param  {INT|String} x X-coordinate
     * @param  {INT|String} y y-coordinate
     * @param  {String} f FACE coordinate ('NORTH','EAST', 'SOUTH', 'WEST'). Can
     * come either lowercased of uppercased
     * @return {Error|Robot}   If placed succsessfully it returs this, if not
     * successfully, it returns a corresponding Error instance
     * @public
     */
         place(arg : CoordinateInputCommands) : Robot | Error {

            var argNew : Coordinate;
    
            // Validate user input
            try {
                argNew = this._validateInput(arg);
            } catch (e) {
                return e;
            }
    
            // PLACE a robot only inside of the playground
            if (this._isOutOfPlayground(argNew.x, argNew.y)) {
                return new Error(this._messenger.getMessage({
                    msg: 'wrongPlace'
                }));
            }
    
            // Places a robot - updates its X,Y,F, F is String here
            this._setRobotPosition(argNew);
    
            // Save that initial PLACE has been made
            if (!this._isFirstStepMade)
                this._isFirstStepMade = true;
    
            return this;
        }

    /**
     * To MOVE the robot. It is not possible to move the robot if no initial
     * PLACE was made - error is returned.
     * @return {Error|Robot} Robot's instance on succsess and Error instance if
     * any error occurred
     * @public
     */
     move() : Error | Robot {
        let coordinate : Coordinate = {
            x:undefined,
            y:undefined,
            f:undefined
        };

        // Check if initial PLACE command was made
        if (!this._isFirstStepMade) {
            return new Error(this._messenger.getMessage({
                msg: 'noInitialCommand'
            }));;
        }

        coordinate.x = this._oCurrentPosition.x;
        coordinate.y = this._oCurrentPosition.y;
        coordinate.f = this._oCurrentPosition.f;

        // Change X or Y correctly to
        switch (coordinate.f) {
            case 'NORTH': // north
                --coordinate.y;
                break;
            case 'EAST': // east
                ++coordinate.x;
                break;
            case 'SOUTH': // south
                ++coordinate.y
                break;
            case 'WEST': // west
                --coordinate.x;
                break;
        }

        // Check if the step in not outside the playground
        if (this._isOutOfPlayground(coordinate.x, coordinate.y)) {
            return new Error(this._messenger.getMessage({
                msg: 'wrongMove'
            }));
        }

        // updetes the robot's position
        this._setRobotPosition(coordinate);

        return this;
    }

    /**
     * To turn the robot to the right, that is change its FACE
     * @return {Error|Robot}   If succsess it returs this, if not
     * success, it returns a corresponding Error instance
     */
     right() : Error | Robot {
        if (!this._isFirstStepMade) {
            return new Error(this._messenger.getMessage({
                msg: 'noInitialCommand'
            }));
        }
        let facingIndex = this._config.aDirections.indexOf(this._oCurrentPosition.f)
        let postIndex = (facingIndex + 1) > 3 ? 0 : facingIndex + 1;

        this._oCurrentPosition.f = this._config.aDirections[postIndex];
        return this;
    }
    /**
     * To turn the robot to the left, that is change its FACE
     * @return {Error|Robot}   If succsess it returs this, if not
     * success, it returns a corresponding Error instance
     */
    left() : Error | Robot {
        if (!this._isFirstStepMade) {
            return new Error(this._messenger.getMessage({
                msg: 'noInitialCommand'
            }));
        }
        let facingIndex = this._config.aDirections.indexOf(this._oCurrentPosition.f)
        let postIndex = (facingIndex - 1) < 0 ? 3 : facingIndex - 1;
        
        this._oCurrentPosition.f = this._config.aDirections[postIndex];
        return this;
    }


    /**
     * Send a message to a user
     * @param  {Object} msgObj {msg 'msgKey', [anyOtherKeys: ....]}
     * Possible keys are defined in the config.
     * @return {[type]}        [description]
     */
     report( msgObj? : operationData ) : string {
        // Call .report() without any parameters.
        if (!msgObj) {
            let oPosition : Coordinate = this._getRobotPosition();

            // Very beginning, no any PLACE yet, coords are undefined
            // return a message "PLACE a robot to begin", not coords
            if (oPosition.x == undefined &&
                oPosition.y == undefined &&
                oPosition.f == undefined) {
                return this._messenger.getMessage({
                    msg: 'placeRobotFirst'
                });
                // coords are defined, return robot's position msg
            } else {
                return this._messenger.getMessage({
                    msg: 'robotPosition',
                    x: oPosition.x,
                    y: oPosition.y,
                    f: oPosition.f
                });
            }
        } else
            return this._messenger.getMessage(msgObj);
    }

    /**
     * Check if action is performed inside of the playground
     * @param   {INT}  x x-coordinate
     * @param   {INT}  y y-coordinate
     * @return  {Boolean}
     * @private
     */
     _isOutOfPlayground(x : number, y : number) : boolean{
        return this._playground.isOutOfPlayground(x, y);
    }

    /**
     * Validate user input for PLACEX,Y,F command. X and Y should be INTs or a
     * String that can be converted to INT
     * @param   {INT|String} x x-coordinate
     * @param   {INT|String} y y-coordinate
     * @param   {String} f [NORTH, EAST, SOUTH, WEST]. Can
     * come either lowercased of uppercased
     * @return  {Object}  {x: correct-int-x, y: correct-int-y, f:
     * correct-FACE-word}. F is returned only UPPERCASED!
     * @private
     */
     _validateInput( arg : CoordinateInputCommands) : Coordinate {

        // FACE cannot be undefined
        if (!arg.f) {
            throw new TypeError(this._messenger.getMessage({
                msg: 'noFace'
            }));
        }

        // FACE must be a string
        if (typeof arg.f !== 'string') {
            throw new TypeError(this._messenger.getMessage({
                msg: 'faceNotString'
            }));
        }

        let _coordinate : Coordinate = {
            x:undefined,
            y:undefined,
            f:undefined
        };
        _coordinate.f = arg.f.toUpperCase();
        _coordinate.x = typeof arg.x === 'string' ? parseInt(arg.x) : arg.x;
        _coordinate.y = typeof arg.y === 'string' ? parseInt(arg.y) : arg.y;

        // Only either INT or Strings that can be parsed to INT are accepted as
        // coordinatres
        if (!Number.isInteger(_coordinate.x) || !Number.isInteger(_coordinate.x)) {
            throw new TypeError(this._messenger.getMessage({
                msg: 'nonIntCoordinates'
            }));
        }

        // Only positive X and Y are accepted
        if (_coordinate.x < 0 || _coordinate.y < 0) {
            throw new TypeError(this._messenger.getMessage({
                msg: 'noNegativeCoordinates'
            }));
        }

        // Only valid FACE words are accepted
        // 'NORTH', 'EAST', 'SOUTH', 'WEST'
        if (!this._isDirectionValid(_coordinate.f)) {
            throw new TypeError(this._messenger.getMessage({
                msg: 'wrondDirection'
            }));
        }

        return _coordinate;
    }

    /**
     * Update the robot's position
     * @param   {INT} x x-coordinate
     * @param   {INT} y y-coordinate
     * @param   {String} f FACE, 'NORTH', 'EAST', 'SOUTH' or 'WEST' (uppercased)
     * @private
     */
     _setRobotPosition( arg : Coordinate ) {
        this._oCurrentPosition.x = arg.x;
        this._oCurrentPosition.y = arg.y;
        this._oCurrentPosition.f = arg.f; //String
        //this._config.robot.aDirections.indexOf(arg.f);
    }


    /**
     * Check if FACE is a valid word, that is 'NORTH', 'EAST', 'SOUTH' or 'WEST'
     * @param   {String}  sFace 'NORTH', 'EAST', 'SOUTH' or 'WEST' (uppercased)
     * @return  {Boolean}
     * @private
     */
     _isDirectionValid(sFace : string) : boolean {
        return this._config.aDirections.indexOf(sFace) !== -1;
    }


    /**
     * Getter.
     * @return  {Object} {x: int-x, y: int-y, f: FACE-word (uppercased)}
     * @private
     */
     _getRobotPosition() : Coordinate { 
        return {
            x: this._oCurrentPosition.x,
            y: this._oCurrentPosition.y,
            f: this._oCurrentPosition.f
            // facingword: this._config.aDirections[this._oCurrentPosition.f]
        };
    }


    /**
     * These methods are for the sake of testing or for a development fun
     */
     _getIsFirstStepMade() : boolean{
        return this._isFirstStepMade;
    }

    _isFirstStepMadeFunc() : boolean | string {
        if (!this._isFirstStepMade) {
            return this.report({
                msg: 'noInitialCommand'
            });
        } else
            return true;
    }

    _setIsFirstStepMade(val : boolean) {
        this._isFirstStepMade = val;
    }

    /**
     * Get Messenger instance
     * @return {Messenger} messenger instance
     * @public
     */
    getMessenger() : Messenger {
        return this._messenger;
    }


}