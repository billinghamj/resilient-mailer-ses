var SES = require('aws-sdk').SES;

module.exports = Provider;

/**
 * Creates an instance of the AWS SES email provider.
 *
 * @constructor
 * @this {Provider}
 * @param {object} [options] Optional configuration. See: {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#constructor-property}
 */
function Provider(options) {
	options = options || {};
	options.region = options.region || 'us-east-1';

	this._ses = new SES(options);
}

/**
 * Indicates the outcome of a mail-sending attempt.
 * @callback Provider~onResult
 * @param {error} [error] A non-null value indicates failure.
 */

/**
 * Attempts to send the message through the Mailgun API.
 *
 * @this {Provider}
 * @param {Message} message The message to send.
 * @param {Provider~onResult} [callback] Notified when the attempt fails or succeeds.
 */
Provider.prototype.mail = function (message, callback) {
	// this can fail if the message is invalid
	try {
		var params = this._objectForMessage(message);
	} catch (error) {
		if (callback)
			callback(error);

		return;
	}

	this._ses.sendEmail(params, function (err, data) {
		if (!callback)
			return;

		if (err)
			callback(err);
		else
			callback();
	});
};

Provider.prototype._objectForMessage = function (message) {
	message = message || {};
	message.to = message.to || [];
	message.cc = message.cc || [];
	message.bcc = message.bcc || [];

	// ses will return an error if these are missing
	if (!message.from
		|| (!message.to.length && !message.cc.length && !message.bcc.length)
		|| !message.subject
		|| (!message.textBody && !message.htmlBody)) {
		throw new Error('Invalid parameters');
	}

	if (message.replyto)
		var replyTo = [message.replyto];

	if (message.textBody)
		var textBody = { Data: message.textBody };

	if (message.htmlBody)
		var htmlBody = { Data: message.htmlBody };

	// todo: attachment support

	return {
		Source: message.from,
		ReplyToAddresses: replyTo,

		Destination: {
			ToAddresses: message.to,
			CcAddresses: message.cc,
			BccAddresses: message.bcc
		},

		Message: {
			Subject: { Data: message.subject },

			Body: {
				Text: textBody,
				Html: htmlBody
			}
		}
	};
};
