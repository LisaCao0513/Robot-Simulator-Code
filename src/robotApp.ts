'use strict';
import process from "process";
import readLine from "readline"; // Readline class. To read commands from a file
import { robotFactory } from "./robotFactory";
import fs from "fs";  // to check if a file exists and is readable and to create a stream
import { Messenger } from "./messenger";
import { Robot } from "./robot";
import { CoordinateCommands } from "./types";

export class robotApp {

    robot : Robot;
    private stdin = process.stdin;
    private os = require("os"); // to have platform independent EOL
    private stdout = process.stdout;
    private stderr = process.stderr;
    private EOL = this.os.EOL;
    messenger : Messenger;

    constructor(){
        this.init();
    }

            /**
     * Sends a response from doAction() to stdout or stderr
     * @param  {Error|String|Object} either an Error instance, or a message string,
     * or robot instance.
     * @return {undefined}      no return. the func only sends to stdout or stderr
     */
     doOutput(data : string) {
            var res : Error | string | Robot ;
            var _data : string = data.trim();
    
            if (_data.match(/(q|quit|exit)/i))
                process.exit();
    
            res = this.doAction(_data);
            if (res instanceof Error) {
                this.stdout.write(res.message + this.EOL + '> ');
            } else if (typeof res == 'string') {
                this.stdout.write(res + this.EOL + '> ');
            } else {
                this.stdout.write('> ');
            }
        }

    init(){
        /**
         * Declare and initialize variables
         */
        
        this.robot = new robotFactory().robot; // a robot instance
        let rl; // readline instance
        let argv; // for cli arguments, particularly to get a file path
        this.messenger = this.robot.getMessenger(); // to create and send messages to user
        this.stdin.setEncoding('utf8');
        process.title = "== The Toy Robot =="; // sets a terminal title

        argv = process.argv.slice(2); // get only the name of the file from user prompt

        // read stdin
        // this piece of code is for reading user's input from CLI
        this.stdin.on('data', (data : any) => {
            this.doOutput(data);
            });

        // this piece of code is for reading commands from a file
        if (argv.length) {
            try {
                fs.accessSync(argv[0], fs.constants.F_OK | fs.constants.R_OK)
            } catch (e) {
                this.stderr.write(this.messenger.getMessage({
                    msg: 'fileNotFound',
                    fileName: argv[0]
                }));
                process.exit();
            }


            rl = readLine.createInterface({
                input: fs.createReadStream(argv[0]),
                terminal: false
            });

            // event handler. is called when a line is read from a file
            rl.on('line', (line : string) => {
                this.stdout.write(line + this.EOL);
                this.doOutput(line);
            });

            // event handler. is called when all the lines in a file have been read
            // closes a stream and exit
            rl.on('close', () => {
                rl.close();
                process.exit();
            });
        }

    }



    /**
     * This parser encapsulates the task of reading a user's input, either form CLI
     * or from a file.
     *
     * @param  {String} sCommand A command from a user, like "PLACE, MOVE, etc."
     * @return {Error|String|Object} Returns either an Error instance, or a message
     * string, or the robot instance. A successful action returns robot's instance.
     * @private
     */
    doAction(sCommand : string) : string | Error | Robot {
        var res : string | Error | Robot;
        // PLACE X(,| )Y(,| )F(  *)
        if (sCommand.match(/^\s*place\s+\w+(?:,?\s*|\s+)\w+(?:,?\s*|\s+)\w+\s*$/i)) {
            var args = sCommand.trim().split(/(?:\s+|,\s*)/i).slice(1);
            let robotCommands : CoordinateCommands = {
                x: args[0],
                y: args[1],
                f: args[2]
            } 
            res = this.robot.place(robotCommands);
        } else if (sCommand.match(/^move\s*$/i)) {
            res = this.robot.move();
        } else if (sCommand.match(/^left\s*$/i)) {
            res = this.robot.left();
        } else if (sCommand.match(/^right\s*$/i)) {
            res = this.robot.right();
        } else if (sCommand.match(/^report\s*$/i)) {
            res = this.robot.report();
        } else {
            res = new Error(this.messenger.getMessage({
                msg: 'unknownCommand'
            }));
        }
        return res;
    }


    //Method RUN App
    public run() {
        this.stdout.write(this.messenger.getMessage({
            msg: 'welcome',
            eol: this.EOL
        }) + this.EOL + '> ');
        this.stdin.resume();
    }

}
