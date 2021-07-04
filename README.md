## Descriptions
Task : https://github.com/wearefirelabs/robot-simulator

## Solutions

1. Config 
    Store configuration data of robot, messenger, playground
2. Messenger
    Messenger is a class that incapsulates all the behaviour of preparing any messages a robot can send to a user. It is the robot's dependency.
3. Playground
    Playground is a class that represents a playgroung where the robot walks. It is the robot's dependency. 
    Now is a 6X6 units playground. x, y range in [0,1,2,3,4,5]
4. Robot
    Robot is a class that represents a robot and defines its functionality. Five public methods to control the robot:
    place(x, y, f)
    move()
    left()
    right()
    report()
    getMessenger()
5. RobotFactory
    RobotFactory is a factory class that assembles the robot, that is resolves all its dependencies, injects them into the robot, instantiates the robot and returns the instance to the caller.
6. RobotApp
    RobotApp is a module that combines all components together into a one usable application.
7. Start.js 
    Starting script
8. types 
    interfaces and types

## Environments
1. Node.js
2. Typescript
3. Jest

## Run scripts
```
$ cd robot-simulator-code

$ npm install

$ npm start
// Commands
<!-- PLACE X,Y,F or PLACE X Y F (spaces are acceptable instead of commas)
MOVE
LEFT
RIGHT
REPORT -->

//read commands from a txt file
$ npm start commands.txt 

//Testing
//Run all test 
$ npm run test
```