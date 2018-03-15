describe('d2l-image-banner-overlay', function() {
	var component,
		organizationEntity,
		sandbox;

	var animFrame = requestAnimationFrame || setTimeout;

	function setupFetchStub(options) {
		if (!options.canChangeImage) {
			organizationEntity.actions = organizationEntity.actions.filter(function(action) {
				return action.name !== 'set-catalog-image';
			});
		}
		if (!options.canRemoveBanner) {
			organizationEntity.actions = organizationEntity.actions.filter(function(action) {
				return action.name !== 'remove-homepage-banner';
			});
		}

		window.d2lfetch.fetch = sandbox.stub()
			.withArgs(sinon.match.has('url', 'http://example.com/'))
			.returns(Promise.resolve({
				ok: true,
				json: function() { return Promise.resolve(organizationEntity); }
			}));
	}

	beforeEach(function() {
		organizationEntity = {
			'class': ['active', 'course-offering'],
			'properties': {
				'name': 'Actuators & Power Electronics',
				'code': 'MTE320',
				'startDate': null,
				'endDate': null,
				'isActive': true
			},
			'entities': [{
				'class': ['relative-uri'],
				'rel': ['item', 'https://api.brightspace.com/rels/organization-homepage'],
				'properties': {
					'path': '/d2l/home/121768'
				}
			}, {
				'class': ['course-image'],
				'rel': ['https://api.brightspace.com/rels/organization-image'],
				'href': 'https://lms.com/organizations/121768/image?version=%2fimages%2fb7105a50-bd33-48d9-8c5a-39d3e6a98c43'
			}],
			'links': [{
				'rel': ['self'],
				'href': 'https://lms.com/organizations/121768'
			}, {
				'rel': ['https://api.brightspace.com/rels/course-offering-info-page'],
				'type': 'text/html',
				'href': 'https://lms.com/d2l/lp/manageCourses/course_offering_info_viewedit.d2l?ou=121768'
			}],
			'actions': [{
				'href': 'https://lms.com/d2l/api/lp/1.9/courses/121768/image',
				'name': 'set-catalog-image',
				'method': 'POST',
				'fields': [{
					'type': 'text',
					'name': 'imagePath',
					'value': ''
				}]
			}, {
				'href': 'https://lms.com/organizations/121768',
				'name': 'remove-homepage-banner',
				'method': 'PUT',
				'fields': [{
					'type': 'hidden',
					'name': 'showCourseBanner',
					'value': false
				}]
			}, {
				'href': 'https://lms.com/organizations/121768',
				'name': 'add-homepage-banner',
				'method': 'PUT',
				'fields': [{
					'type': 'hidden',
					'name': 'showCourseBanner',
					'value': true
				}]
			}]
		};
		sandbox = sinon.sandbox.create();
		component = fixture('d2l-image-banner-overlay-fixture');
		component.hasChangeImage = true;
	});

	afterEach(function() {
		sandbox.restore();
	});

	it('should exist on the page', function() {
		expect(component).to.exist;
		expect(component.is).to.equal('d2l-image-banner-overlay');
	});

	it('should fetch organization information from organizationUrl', function() {
		var stub = sandbox.stub(window.d2lfetch, 'fetch')
			.withArgs(sinon.match.has('url', 'http://example.com/'))
			.returns(Promise.resolve({
				ok: true,
				json: function() { return Promise.resolve(organizationEntity); }
			}));
		component.organizationUrl = 'http://example.com/';

		return component._getOrganizationInfo().then(function() {
			expect(stub).to.have.been.called;
			expect(component._courseName).to.equal('Actuators & Power Electronics');
			expect(component._removeBannerUrl).to.equal('https://lms.com/organizations/121768');
			expect(component._changeImageUrl).to.equal('https://lms.com/d2l/api/lp/1.9/courses/121768/image');
			expect(component._courseOfferingInfoLink).to.equal('https://lms.com/d2l/lp/manageCourses/course_offering_info_viewedit.d2l?ou=121768');
		});
	});

	describe('event listeners', function() {

		var eventTestCases = [
			{ name: 'd2l-alert-button-pressed', observer: '_onAlertButtonPressed' },
			{ name: 'd2l-alert-close', observer: '_onAlertClosed' },
			{ name: 'clear-image-scroll-threshold', observer: '_onClearImageScrollThreshold' },
			{ name: 'd2l-simple-overlay-closed', observer: '_onSimpleOverlayClosed' },
			{ name: 'set-course-image', observer: '_onSetCourseImage' }
		];

		eventTestCases.forEach(function(testCase) {
			it('should listen for "' + testCase.name + '" events', function(done) {
				sinon.stub(component, testCase.observer)
					.returns(Promise.resolve().then(done));
				window.dispatchEvent(new CustomEvent(testCase.name));
			});
		});

		eventTestCases.forEach(function(testCase) {
			it('should remove listener listen for "' + testCase.name + '" when detached', function(done) {
				var spy = sinon.stub(component, testCase.observer);
				Polymer.dom(component.parentNode).removeChild(component);
				animFrame(function() {
					document.body.dispatchEvent(new CustomEvent(testCase.name));
					animFrame(function() {
						expect(spy.notCalled).to.be.true;
						done();
					});
				});
			});
		});

		describe('set-course-image', function() {

			['success', 'failure'].forEach(function(eventName) {
				it('should set the ' + eventName + ' icon on a "' + eventName + '" event', function() {
					component.organizationUrl = '';
					component._displaySetImageResult = sandbox.stub();

					component._onSetCourseImage({
						detail: {
							status: eventName,
							organization: {},
							image: {}
						}
					});

					expect(component._displaySetImageResult).to.have.been.calledWith(eventName === 'success');
				});
			});

			it('should update the image src on "set" event', function() {
				component.organizationUrl = '';
				component._getDefaultImageLink = sandbox.stub().returns('http://example.com');

				component._onSetCourseImage({
					detail: {
						status: 'set',
						organization: {},
						image: { foo: 'bar' }
					}
				});

				expect(JSON.stringify(component._nextImage)).to.equal('{"foo":"bar"}');
			});

			it('should close the image-selector overlay', function() {
				var spy = sandbox.spy(component.$['basic-image-selector-overlay'], 'close');

				component._onSetCourseImage({
					detail: {
						status: 'set',
						organization: {},
						image: { foo: 'bar' }
					}
				});

				expect(spy).to.have.been.called;
			});
		});

	});

	describe('hasChangeImage', function() {
		[
			{ name: 'hide change image button when false', canChangeImage: true, hasChangeImage: false },
			{ name: 'not override a user\'s lack of permissions when true', canChangeImage: false, hasChangeImage: true }
		].forEach(function(testCase) {
			it('should ' + testCase.name, function() {
				setupFetchStub({ canChangeImage: testCase.canChangeImage });
				component.hasChangeImage = testCase.hasChangeImage;

				return component._getOrganizationInfo().then(function() {
					expect(window.d2lfetch.fetch).to.have.been.called;
					expect(component.$$('d2l-dropdown-more').hasAttribute('hidden')).to.be.true;
				});
			});
		});
	});

	describe('_toggleCourseBanner', function() {
		it('should make the call to remove the banner', function() {
			component._addBannerUrl = null;
			component._removeBannerUrl = 'http://example.com';
			component._showAlert = sandbox.stub();
			window.d2lfetch.fetch = sandbox.stub()
				.withArgs(sinon.match.has('url', 'http://example.com/'))
				.withArgs(sinon.match.has('method', 'PUT'))
				.withArgs(sinon.match.has('body', 'showCourseBanner=false'))
				.returns(Promise.resolve({
					ok: true,
					json: function() { return Promise.resolve(organizationEntity); }
				}));
			organizationEntity.actions = organizationEntity.actions.filter(function(action) {
				return action.name !== 'remove-homepage-banner';
			});

			return component._toggleCourseBanner().then(function() {
				expect(component._showAlert).to.have.been.calledWith(true);
				expect(component._addBannerUrl).to.equal('https://lms.com/organizations/121768');
				expect(component._removeBannerUrl).to.be.undefined;
				expect(component._showBannerRemovedAlert).to.be.true;
			});
		});

		it('should make the call to add the banner', function() {
			component._addBannerUrl = 'http://example.com';
			component._removeBannerUrl = null;
			component._showAlert = sandbox.stub();
			window.d2lfetch.fetch = sandbox.stub()
				.withArgs(sinon.match.has('url', 'http://example.com/'))
				.withArgs(sinon.match.has('method', 'PUT'))
				.withArgs(sinon.match.has('body', 'showCourseBanner=true'))
				.returns(Promise.resolve({
					ok: true,
					json: function() { return Promise.resolve(organizationEntity); }
				}));
			organizationEntity.actions = organizationEntity.actions.filter(function(action) {
				return action.name !== 'add-homepage-banner';
			});

			return component._toggleCourseBanner().then(function() {
				expect(component._showAlert).to.have.been.calledWith(false);
				expect(component._addBannerUrl).to.be.undefined;
				expect(component._removeBannerUrl).to.equal('https://lms.com/organizations/121768');
				expect(component._showBannerRemovedAlert).to.be.false;
			});
		});

		it('should properly handle an error when trying to add/remove the banner', function() {
			component._addBannerUrl = 'http://example.com';
			component._showAlert = sandbox.stub();
			window.d2lfetch.fetch = sandbox.stub()
				.withArgs(sinon.match.has('url', 'http://example.com/'))
				.withArgs(sinon.match.has('method', 'PUT'))
				.withArgs(sinon.match.has('body', 'showCourseBanner=true'))
				.returns(Promise.resolve({ ok: false }));

			return component._toggleCourseBanner().catch(function() {
				expect(component._showAlert).to.have.been.calledWith(true);
				expect(component._removeBannerUrl).to.be.null;
				expect(component._showBannerRemovedAlert).to.be.true;
			});
		});
	});

	describe('dropdown menu', function() {
		[
			{ name: 'not show menu', canChangeImage: false, canRemoveBanner: false },
			{ name: 'show change image button', canChangeImage: true, canRemoveBanner: false },
			{ name: 'show remove banner button', canChangeImage: false, canRemoveBanner: true },
			{ name: 'show change image button and remove banner button', canChangeImage: true, canRemoveBanner: true },
		].forEach(function(testCase) {
			it('should ' + testCase.name, function() {
				setupFetchStub({
					canChangeImage: testCase.canChangeImage,
					canRemoveBanner: testCase.canRemoveBanner
				});
				component.organizationUrl = 'http://example.com';

				return component._getOrganizationInfo().then(function() {
					expect(window.d2lfetch.fetch).to.have.been.called;
					expect(component.$$('d2l-dropdown-more').hasAttribute('hidden')).to.equal(!testCase.canChangeImage && !testCase.canRemoveBanner);
					expect(component.$['change-image-button'].hasAttribute('hidden')).to.equal(!testCase.canChangeImage);
					expect(component.$['opt-out-button'].hasAttribute('hidden')).to.equal(!testCase.canRemoveBanner);
				});
			});
		});

		describe('when the department-banner-flag is off', () => {
			it('should appear without hover or focus', () => {
				component.departmentBannerFlag = false;
				expect(window.getComputedStyle(component.$$('d2l-dropdown-more'), null).getPropertyValue('padding-top')).to.equal('30px');
				expect(window.getComputedStyle(component.$$('d2l-dropdown-more'), null).getPropertyValue('opacity')).to.equal('1');
			});

			it('should appear with focus/hover too', () => {
				component.departmentBannerFlag = false;
				component._onFocus();
				expect(window.getComputedStyle(component.$$('d2l-dropdown-more'), null).getPropertyValue('padding-top')).to.equal('30px');
				expect(window.getComputedStyle(component.$$('d2l-dropdown-more'), null).getPropertyValue('opacity')).to.equal('1');
			});
		});

		describe('when the department-banner-flag is on', () => {
			it('should not appear without hover or focus', () => {
				component.departmentBannerFlag = true;
				expect(window.getComputedStyle(component.$$('d2l-dropdown-more'), null).getPropertyValue('padding-top')).to.equal('0px');
				expect(window.getComputedStyle(component.$$('d2l-dropdown-more'), null).getPropertyValue('opacity')).to.equal('0');
			});

			it('should appear on focus/hover', () => {
				component.departmentBannerFlag = true;
				component._onFocus();
				expect(window.getComputedStyle(component.$$('d2l-dropdown-more'), null).getPropertyValue('padding-top')).to.equal('10px');
				expect(window.getComputedStyle(component.$$('d2l-dropdown-more'), null).getPropertyValue('opacity')).to.equal('1');
			});
		});

		describe('when the homepage-manage-menu-flag is on', () => {
			it('should show the alert message which references the homepage manage menu', () => {
				component.homepageManageMenuFlag = true;
				component._showBannerRemovedAlert = true;
				expect(component.$$('#bannerRemovedMenuAlertText').hasAttribute('hidden')).to.equal(false);
			});

			it('should not show the alart message with a link to course offering page', () => {
				component.homepageManageMenuFlag = true;
				component._showBannerRemovedAlert = true;
				expect(component.$$('#bannerRemovedAlertText').hasAttribute('hidden')).to.equal(true);
			});
		});

		describe('when the homepage-manage-menu-flag is off', () => {
			it('should not show the alert message which references the homepage manage menu', () => {
				component.homepageManageMenuFlag = false;
				component._showBannerRemovedAlert = true;
				expect(component.$$('#bannerRemovedMenuAlertText').hasAttribute('hidden')).to.equal(true);
			});

			it('should show the alart message with a link to course offering page', () => {
				component.homepageManageMenuFlag = false;
				component._showBannerRemovedAlert = true;
				expect(component.$$('#bannerRemovedAlertText').hasAttribute('hidden')).to.equal(false);
			});
		});
	});
});
