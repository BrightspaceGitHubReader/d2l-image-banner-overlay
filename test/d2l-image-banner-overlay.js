describe('d2l-image-banner-overlay', function() {
	var component;

	beforeEach(function() {
		component = fixture('d2l-image-banner-overlay-fixture');
	});

	it('should exist on the page', function() {
		expect(component.$$('.d2l-image-banner-overlay') !== null).to.equal(true);
	});
});
