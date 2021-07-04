// An interface can be named in an extends or implements clause, but a type alias for an object type literal cannot.
// An interface can have multiple merged declarations, but a type alias for an object type literal cannot.


export interface CoordinateObject {
    x: number;
    y: number;
    f: string;
}

export type Coordinate = CoordinateObject | null;

export interface CoordinateCommands {
    x: number | string;
    y: number | string;
    f: string;
}

export type CoordinateInputCommands = CoordinateCommands | null;

export interface RobotConfig {
    aCommands : string[];
    initialCommands : string[];
    aDirections :string[];
}

export interface basePlayground {
    startPointX : number;
    startPointY : number;
    lengthX : number;
    lengthY : number;
}

export interface App {
    root : string
}

export interface baseMessenger {
    oMsgs : {};
    oSubs : {};
}

export interface BaseConfig {

}

export interface operationData {
    msg: string;
    x?: number;
    y?: number;
    f?: string;
    fileName?: string;
    eol?: string;
    anyKey?: string;
}