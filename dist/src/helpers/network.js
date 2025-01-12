"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MY_IP_ADDRESS = void 0;
const os_1 = require("os");
function getIPAddress() {
    const interfaces = (0, os_1.networkInterfaces)();
    for (let devName in interfaces) {
        const iface = interfaces[devName];
        if (!iface)
            break;
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '0.0.0.0';
}
exports.MY_IP_ADDRESS = getIPAddress();
