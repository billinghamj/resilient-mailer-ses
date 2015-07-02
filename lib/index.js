var SES = require('aws-sdk').SES;
var MailComposer = require('mailcomposer').MailComposer;

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
 * Attempts to send the message through the AWS SES API.
 *
 * @this {Provider}
 * @param {Message} message The message to send.
 * @param {Provider~onResult} [callback] Notified when the attempt fails or succeeds.
 */
Provider.prototype.mail = function (message, callback) {
	// this can fail if the message is invalid
	var composer;
	try {
		composer = this._composerForMessage(message);
	} catch (error) {
		if (callback)
			callback(error);
		return;
	}

	var ses = this._ses;

	composer.buildMessage(function (err, data) {
		if (err) {
			if (callback)
				callback(err);
			return;
		}

		var params = {
			RawMessage: { Data: data }
		};

		ses.sendRawEmail(params, function (err) {
			if (!callback)
				return;

			if (err)
				callback(err);
			else
				callback();
		});
	});
};

Provider.prototype._composerForMessage = function (message) {
	message = message || {};
	message.to = message.to || [];
	message.cc = message.cc || [];
	message.bcc = message.bcc || [];
	message.attachments = message.attachments || [];

	// ses will return an error if these are missing
	if (
		(!message.from) ||
		(!message.to.length && !message.cc.length && !message.bcc.length) ||
		(!message.subject) ||
		(!message.textBody && !message.htmlBody)) {
		throw new Error('Invalid parameters');
	}

	var composer = new MailComposer();

	composer.setMessageOption({
		from: message.from,
		replyTo: message.replyto,
		to: message.to,
		cc: message.cc,
		bcc: message.bcc,
		subject: message.subject,
		text: message.textBody,
		html: message.htmlBody
	});

	message.attachments.forEach(function (attachment) {
		composer.addAttachment({
			fileName: attachment.name,
			contentType: attachment.type,
			contents: new Buffer(attachment.data, 'base64').toString('utf8')
		});
	});

	return composer;
};
