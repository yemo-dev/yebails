"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformId = exports.Browsers = void 0;

const os = require("os");
const { proto } = require("../../WAProto/index.js"); 

const PLATFORM_MAP = {
    'aix': 'AIX',
    'darwin': 'Mac OS',
    'win32': 'Windows',
    'android': 'Android',
    'freebsd': 'FreeBSD',
    'openbsd': 'OpenBSD',
    'sunos': 'Solaris',
    'linux': undefined,
    'haiku': undefined,
    'cygwin': undefined,
    'netbsd': undefined
};



exports.Browsers = (browser) => {
    const osName = PLATFORM_MAP[os.platform()] || 'Ubuntu';
    const osRelease = os.release();
    return [osName, browser, osRelease];
};

const getPlatformId = (browser) => {
    const platformType = proto.DeviceProps.PlatformType[browser.toUpperCase()];
    return platformType ? platformType.toString() : '1';
};

exports.getPlatformId = getPlatformId;