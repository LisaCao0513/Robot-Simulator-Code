'use strict';
import { Robot } from "./robot";
import { Config } from "./config";
import { Playground } from "./playground";
import { Messenger } from "./messenger";

/**
 * Toy Robot Factory
 * It assembles a robot instance, injects its dependencies.
 * The factory returns a robot instance.
 */


export class robotFactory{
    robot : Robot;

    constructor(){
        const config = new Config();
        this.robot = new Robot(config.robotConfig, new Playground(config.playground), new Messenger(config.messenger));
    }

}

