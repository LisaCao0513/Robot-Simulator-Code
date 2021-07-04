import { Playground } from "../src/playground";
import { Config } from "../src/config";
import { Robot } from "../src/robot";
import { Messenger } from "../src/messenger";
import { Coordinate,CoordinateInputCommands } from "../src/types"

describe ('The robot', () => {

    let robot : Robot;
    let messenger : Messenger;
    let config = new Config();
    let coordinator : Coordinate;
    let aDirections : string[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

    beforeAll(() => {
        messenger = new Messenger(config.messenger);
    });

    beforeEach(() => {
        robot = new Robot(config.robotConfig,
            new Playground(config.playground),
            messenger);
    });

    test('coordinates should be undefined at start', () => {
        const oPosition : Coordinate = robot._getRobotPosition();
        expect(oPosition.x == undefined &&
            oPosition.y == undefined &&
            oPosition.f == undefined).toBe(true);
    });

    test('should report its position', () => {
        let position : Coordinate = {
            x : 2,
            y : 3,
            f : 'south'
        };

        robot.place(position);

        expect(robot.report()).toEqual(messenger.getMessage({
            msg: 'robotPosition',
            x: position.x,
            y: position.y,
            f: position.f.toUpperCase()
        }));
    });


    test('should say "place me first to begin" at start', () => {
        expect(robot.report()).toEqual(messenger.getMessage({
            msg: 'placeRobotFirst'
        }));
    });

    test('should not accept nonInt X or Y', () => {
        let position : CoordinateInputCommands = {
            x : "foo",
            y : "test",
            f : 'south'
        };
        expect(robot.place(position)).toEqual(new TypeError(
            messenger.getMessage({
                msg: 'nonIntCoordinates'
            })));
    });

    test('should not accept undefined FACE', () => {

        let position : CoordinateInputCommands = {
            x : "foo",
            y : "1,5",
            f : undefined
        };
        expect(robot.place(position)).toEqual(new TypeError(
            messenger.getMessage({
                msg: 'noFace'
            })));
    });

    test('should not accept negative Y in PLACE', () => {
        let position : CoordinateInputCommands = {
            x : 0,
            y : -1,
            f : 'south'
        };
        expect(robot.place(position)).toEqual(new TypeError(
            messenger.getMessage({
                msg: 'noNegativeCoordinates'
            })));
    });

    test('should not accept negative X in PLACE', () =>  {
        let position : CoordinateInputCommands = {
            x : -1,
            y : 0,
            f : 'south'
        };
        expect(robot.place(position)).toEqual(new TypeError(
            messenger.getMessage({
                msg: 'noNegativeCoordinates'
            })));
    });

    test('should not accept invalid FACING words', () => {
        let position : CoordinateInputCommands = {
            x : 2,
            y : 3,
            f : 'test'
        };
        expect(robot.place(position)).toEqual(new TypeError(
            messenger.getMessage({
                msg: 'wrondDirection'
            })));
    });

    test('should not be placed outside the playground', () => {
        let position : CoordinateInputCommands = {
            x : 0,
            y : 10,
            f : 'south'
        };
        expect(robot.place(position)).toEqual(new Error(
            messenger.getMessage({
                msg: 'wrongPlace'
            })));
    });

    test('should have "_isFirstStepMade = false" before initial PLACE',
        () => {
            expect(robot._getIsFirstStepMade()).toBe(false);
        }
    );

    test(
        'should set "_isFirstStepMade = true" upon successful initial PLACE',
        () => {
            let position : CoordinateInputCommands = {
                x : 0,
                y : 1,
                f : 'south'
            };
            robot.place(position);
            expect(robot._getIsFirstStepMade()).toBe(true);
        });

    test('should change X, Y upon successful place', () => {
        
        let position : CoordinateInputCommands = {
            x : 3,
            y : 4,
            f : 'south'
        };

        let oPositionEnd : CoordinateInputCommands = { x:undefined, y:undefined,f:undefined};


        robot.place(position);

        oPositionEnd = robot._getRobotPosition();

        expect(oPositionEnd.x == position.x &&
            oPositionEnd.y == position.y &&
            oPositionEnd.f == position.f.toUpperCase()).toBe(true);
    });

    test('should return itself if PLACE was successful', () => {
        let position : CoordinateInputCommands = {
            x : 1,
            y : 1,
            f : 'south'
        };
        expect(robot.place(position)).toEqual(robot);
    });

    test(
        'should not accept MOVE command before initial PLACE command',
        () => {
            expect(robot.move()).toEqual(new Error(
                messenger.getMessage({
                    msg: 'noInitialCommand'
                })));
        });


    test('should not be able to step out of the playground', () => {
        let position : CoordinateInputCommands = {
            x : 5,
            y : 0,
            f : 'east'
        };
        robot.place(position);
        expect(robot.move()).toEqual(new Error(
            messenger.getMessage({
                msg: 'wrongMove'
            })));
    });

    test('should successfully make a correct MOVE', () => {
        let position : Coordinate = {
            x : 1,
            y : 1,
            f : 'east'
        };
        let positionAfter : Coordinate = {x:undefined, y:undefined, f:undefined};

        robot.place(position);
        robot.move();
        positionAfter = robot._getRobotPosition();
        expect(positionAfter.x == position.x + 1 && positionAfter.y == position.y && positionAfter.f == position.f.toUpperCase())
            .toBe(true);
    });


    test('should not turn RIGHT before initial PLACE was made', () => {
        expect(robot.right()).toEqual(new Error(
            messenger.getMessage({
                msg: 'noInitialCommand'
            })));
    });

    test('should not turn LEFT before initial PLACE was made', () => {
        expect(robot.left()).toEqual(new Error(
            messenger.getMessage({
                msg: 'noInitialCommand'
            })));
    });

    test('should turn LEFT (change face)', () =>  {
        let position : Coordinate = {
            x : 1,
            y : 1,
            f : 'east'
        };
        robot.place(position);
        robot.left()
        expect(robot._getRobotPosition().f).toEqual('NORTH');
    });

    test('should turn RIGHT (change face)', () => {
        let position : Coordinate = {
            x : 1,
            y : 1,
            f : 'east'
        };
        robot.place(position);
        robot.right();
        expect(robot._getRobotPosition().f).toEqual('SOUTH');
    });


})