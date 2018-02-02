'use strict';
(function() {
var organizationEntity = {
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
var sandbox = sinon.sandbox.create();
window.d2lfetch = window.d2lfetch || {};
window.d2lfetch.fetch = sandbox.stub()
	.withArgs(sinon.match.has('url', '/default'))
	.returns(Promise.resolve({
		ok: true,
		json: function() {
			return Promise.resolve(organizationEntity);
		}
	}));
})();
