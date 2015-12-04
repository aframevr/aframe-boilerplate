# internal-ip [![Build Status](https://travis-ci.org/sindresorhus/internal-ip.svg?branch=master)](https://travis-ci.org/sindresorhus/internal-ip)

> Get your internal IPv4 or IPv6 address


## CLI

```
$ npm install --global internal-ip
```

```
$ internal-ip --help

  Usage
    $ internal-ip

  Options
    --ipv6  Return the IPv6 address instead of IPv4

  Example
    $ internal-ip
    192.168.0.123
    $ internal-ip --ipv6
    fe80::200:f8ff:fe21:67cf
```


## API

```
$ npm install --save internal-ip
```

```js
var internalIp = require('internal-ip');

internalIp.v4();
//=> '192.168.0.123'

internalIp.v6();
//=> 'fe80::200:f8ff:fe21:67cf'
```


## Related

See [public-ip](https://github.com/sindresorhus/public-ip) or [ipify](https://github.com/sindresorhus/ipify) to get your external IP address.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
