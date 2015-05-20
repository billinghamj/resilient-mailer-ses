var test = require('tape');
var Provider = require('../lib');

test('correct types exported', function (t) {
	t.equal(typeof Provider, 'function');
	t.equal(typeof Provider.prototype.mail, 'function');

	t.end();
});

test('correct types after initialization', function (t) {
	var provider = new Provider();

	t.assert(provider instanceof Provider);
	t.equal(typeof provider.mail, 'function');

	t.end();
});

test('api port is chosen correctly', function (t) {
	var prov1 = new Provider();
	var prov2 = new Provider({ apiSecure: false });
	var prov3 = new Provider({ apiSecure: true });

	t.assert(prov1._ses);
	t.assert(prov2._ses);
	t.assert(prov3._ses);

	t.end();
});

test('empty options doesn\'t cause exception', function (t) {
	t.doesNotThrow(function () { new Provider({}); });

	t.end();
});

test('invalid message returns error', function (t) {
	var provider = new Provider();

	t.plan(3);

	provider.mail(null, function (error) { t.equal(error.message, 'Invalid parameters'); });
	provider.mail({}, function (error) { t.equal(error.message, 'Invalid parameters'); });
	provider.mail({to:['']}, function (error) { t.equal(error.message, 'Invalid parameters'); });
});
