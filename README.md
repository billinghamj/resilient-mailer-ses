# resilient-mailer-ses

`resilient-mailer-ses` implements AWS SES as an email provider for
[`resilient-mailer`](//github.com/billinghamj/resilient-mailer).

[![NPM Version](https://img.shields.io/npm/v/resilient-mailer-ses.svg?style=flat)](//www.npmjs.org/package/resilient-mailer-ses)
[![Build Status](https://img.shields.io/travis/cuvva/resilient-mailer-ses.svg?style=flat)](//travis-ci.org/cuvva/resilient-mailer-ses)
[![Coverage Status](https://img.shields.io/coveralls/cuvva/resilient-mailer-ses.svg?style=flat)](//coveralls.io/r/cuvva/resilient-mailer-ses)

```js
var SESProvider = require('resilient-mailer-ses');

var ses = new SESProvider();

var mailer; // ResilientMailer instance
mailer.registerProvider(ses);
```

## Installation

```bash
$ npm install resilient-mailer-ses
```

## Usage

Create an instance of the provider. You can also pass in options which are sent
on to the AWS SDK:

```js
var SESProvider = require('resilient-mailer-ses');

// see: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#constructor-property
var options = {
	accessKeyId: 'accessKey',
	secretAccessKey: 'secretKey',
	region: 'eu-west-1'
};

var ses = new SESProvider(options);
```

To register the provider with your `ResilientMailer` instance:

```js
var mailer; // ResilientMailer instance
mailer.registerProvider(ses);
```

In the event that you want to use `SESProvider` directly (rather than the
usual way - via `ResilientMailer`):

```js
var message = {
	from: 'no-reply@example.com',
	to: ['user@example.net'],
	subject: 'Testing my new email provider',
	textBody: 'Seems to be working!',
	htmlBody: '<p>Seems to be working!</p>'
};

ses.send(message, function (error) {
	if (!error)
		console.log('Success! The message sent successfully.');

	else
		console.log('Message sending failed - ' + error.message);
});
```

To see everything available in the `message` object, refer to
[resilient-mailer](//github.com/billinghamj/resilient-mailer).

## Notes

One instance of the provider covers one domain. To send from multiple domains,
you should set up multiple `ResilientMailer` instances, with multiple matching
provider instances.

## Testing

Install the development dependencies first:

```bash
$ npm install
```

Then the tests:

```bash
$ npm test
```

## Support

Please open an issue on this repository.

## Authors

- James Billingham <james@jamesbillingham.com>

## License

MIT licensed - see [LICENSE](LICENSE) file
