"use strict";
// Mac / Terminal version, for browser version see the console-browser folder. The exports are the same for both extensions.
Object.defineProperty(exports, "__esModule", { value: true });
var bot_1 = require("../../bot/bot");
var colors = require('colors/safe');
var readline = require("readline");
bot_1.MessageBot.registerExtension('console', function (ex, world) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    var log = ex.export('log', function (message) {
        var columns = process.stdout.columns;
        // Set cursor to beginning of current line.
        readline.moveCursor(process.stdout, -200, 0);
        // Pad message to avoid long typed messages showing up.
        console.log(message + ' '.repeat(columns - message.length % columns));
        // Re-prompt for input.
        rl.prompt(true);
    });
    function handleInput(message) {
        if (message.startsWith('//eval')) {
            console.log(eval(message.substr(6)));
            return;
        }
        switch (message) {
            case '//quit':
                return process.exit(0);
            default:
                ex.bot.send(message);
        }
        rl.prompt(true);
    }
    rl.on('line', handleInput);
    function logChat(_a) {
        var player = _a.player, message = _a.message;
        if (player.isAdmin()) {
            log(colors.blue(player.getName()) + ': ' + message);
        }
        else if (player.isMod()) {
            log(colors.green(player.getName()) + ': ' + message);
        }
        else {
            log(player.getName() + ': ' + message);
        }
    }
    world.onMessage.sub(logChat);
    function logJoins(player) {
        var message;
        if (ex.settings.get('logJoinIps', true)) {
            message = player.getName() + " (" + player.getIP() + ") joined the server.";
        }
        else {
            message = player.getName() + " joined the server.";
        }
        log(message);
    }
    world.onJoin.sub(logJoins);
    function logLeaves(player) {
        log(player.getName() + ' left');
    }
    world.onLeave.sub(logLeaves);
    function logOther(message) {
        log(message);
    }
    world.onOther.sub(logOther);
    ex.uninstall = function () {
        world.onMessage.unsub(logChat);
        world.onJoin.unsub(logJoins);
        world.onLeave.unsub(logLeaves);
        world.onOther.unsub(logOther);
        rl.removeListener('line', handleInput);
        rl.close();
    };
});