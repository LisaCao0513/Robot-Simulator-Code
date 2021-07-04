'use strict';
import path  from 'path';
import * as types  from './types';

/**
 * Config object
 * It consists of configs for:
 *   Robot class
 *   Messenger class
 *   Playground class
 */

//interfaces


export class Config implements types.BaseConfig{
    
    app : types.App;
    playground : types.basePlayground;
    robotConfig : types.RobotConfig;
    messenger : types.baseMessenger;

    constructor(){
        this.playground = {
            startPointX: 0,
            startPointY: 0,
            lengthX: 6,
            lengthY: 6
        };
        this.app = { root: path.resolve(__dirname) };
        this.robotConfig = {
            aCommands: ['PLACE', 'MOVE', 'LEFT', 'RIGHT', 'REPORT'],
            initialCommands: ['PLACE'],
            aDirections: ['NORTH', 'EAST', 'SOUTH', 'WEST']
        };
        this.messenger = { 
            oMsgs: {
                noInitialCommand: 'Warning! You haven\'t placed the robot on the playground yet. Type "PLACE X, Y, F" {ci} to put a robot on the playground.',
                placeRobotFirst: 'Nothing to report - the robot is not on the playground yet. Place it first to begin - PLACE X, Y, F.',
                wrongPlace: 'Warning! You cannot place the robot in that square, it can fall. That square is out of the playground.',
                wrondDirection: 'Error! No such a direction. Available directions are: {availableDirections}',
                noFace: 'Error! No FACE was provided. Correct form is: PLACE X, Y, FACE.',
                faceNotString: 'Error! FACE is not a string.',
                unknownCommand: 'Error! Command is incorrect or unknown. Available commands are: {availableCommands}',
                robotPosition: 'Robot\'s position is: {x}, {y}, {f}',
                noNegativeCoordinates: 'Error! No negative X or Y allowed. Try again.',
                nonIntCoordinates: 'Warning! X and Y must be integers.',
                wrongMove: 'Warning! You cannot move the robot that way, it can fall.',
                default: 'Welcome to The Toy Robot game. Start with placing a robot typing PLACE X, Y, F {ci}.',
                someCombinedMsg: 'For the {s} of testing: PLACE {x}, {y}, {z} in {country}',
                fileNotFound: 'Error! File \'{fileName}\' was not found. Make sure you specified its path correctly.',
                welcome: 'Welcome!{eol}Tell the Robot your first command. Begin by placing the Robot on the playground - PLACE X, Y, F {ci}. \'q\' to exit.',
            },
            oSubs: {
                availableDirections: this.robotConfig.aDirections.join(', '),
                availableCommands: [this.robotConfig.aCommands.reduce(function(prev,
                    cur) {
                    if (prev == 'PLACE')
                        prev = [prev, 'X, Y, F'].join(' ');
                    return prev + ' | ' + cur;
                }), '.'].join(''),
                ci: '(case insensitive, spaces are acceptable instead of commas)',
                country: 'AU'
            }
        }
    }

}
