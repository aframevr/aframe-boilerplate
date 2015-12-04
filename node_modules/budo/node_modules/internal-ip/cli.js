#!/usr/bin/env node
'use strict';
var meow = require('meow');
var internalIp = require('./');

var cli = meow({
	help: [
		'Usage',
		'  $ internal-ip',
		'',
		'Options',
		'  --ipv6  Return the IPv6 address instead of IPv4',
		'',
		'Examples',
		'  $ internal-ip',
		'  192.168.0.123',
		'  $ internal-ip --ipv6',
		'  fe80::200:f8ff:fe21:67cf'
	]
});

var fn = cli.flags.ipv6 ? 'v6' : 'v4';

console.log(internalIp[fn]());
