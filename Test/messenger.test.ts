import { Config } from "../src/config";
import { Messenger } from "../src/messenger";
import { Coordinate } from "../src/types";

describe("Messenger testing", () => {
    let config = new Config();
    let messenger : Messenger;
    let position : Coordinate = {x:1, y: 2,f:"south"}

    beforeAll(function() {
        messenger = new Messenger(config.messenger);
    });

    function testItsInLoop(key) {
        test(['should output correct', key, 'message'].join(' '),
            function() {

                expect(messenger.getMessage({
                    msg: key,
                    x: position.x,
                    y: position.y,
                    f: position.f
                })).toEqual(messenger._constructMessage({
                    msg: key,
                    x: position.x,
                    y: position.y,
                    f: position.f
                }));

            });
    }

    /**
     * A loop by itself
     */
    for (var key in config.messenger.oMsgs) {
        testItsInLoop(key);
    }

    
})