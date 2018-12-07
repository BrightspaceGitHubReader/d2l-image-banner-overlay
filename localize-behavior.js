import 'd2l-localize-behavior/d2l-localize-behavior.js';
import './build/lang/ar.js';
import './build/lang/de.js';
import './build/lang/en.js';
import './build/lang/es.js';
import './build/lang/fr.js';
import './build/lang/ja.js';
import './build/lang/ko.js';
import './build/lang/nl.js';
import './build/lang/pt.js';
import './build/lang/sv.js';
import './build/lang/tr.js';
import './build/lang/zh-tw.js';
import './build/lang/zh.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.ImageBanner = window.D2L.PolymerBehaviors.ImageBanner || {};

/*
 * @polymerBehavior D2L.PolymerBehaviors.ImageBanner.LocalizeBehavior
 */
D2L.PolymerBehaviors.ImageBanner.LocalizeBehaviorImpl = {
	properties: {
		resources: {
			value: function() {
				return {
					'en': this.en,
					'ar': this.ar,
					'de': this.de,
					'es': this.es,
					'fr': this.fr,
					'ja': this.ja,
					'ko': this.ko,
					'nl': this.nl,
					'pt': this.pt,
					'sv': this.sv,
					'tr': this.tr,
					'zh': this.zh,
					'zh-tw': this.zhtw
				};
			}
		}
	}
};

/*
 * @polymerBehavior D2L.PolymerBehaviors.ImageBanner.LocalizeBehavior
 */
D2L.PolymerBehaviors.ImageBanner.LocalizeBehavior = [
	D2L.PolymerBehaviors.LocalizeBehavior,
	D2L.PolymerBehaviors.ImageBanner.LocalizeBehaviorImpl,
	D2L.PolymerBehaviors.ImageBanner.LangArBehavior,
	D2L.PolymerBehaviors.ImageBanner.LangDeBehavior,
	D2L.PolymerBehaviors.ImageBanner.LangEnBehavior,
	D2L.PolymerBehaviors.ImageBanner.LangEsBehavior,
	D2L.PolymerBehaviors.ImageBanner.LangFrBehavior,
	D2L.PolymerBehaviors.ImageBanner.LangJaBehavior,
	D2L.PolymerBehaviors.ImageBanner.LangKoBehavior,
	D2L.PolymerBehaviors.ImageBanner.LangNlBehavior,
	D2L.PolymerBehaviors.ImageBanner.LangPtBehavior,
	D2L.PolymerBehaviors.ImageBanner.LangSvBehavior,
	D2L.PolymerBehaviors.ImageBanner.LangTrBehavior,
	D2L.PolymerBehaviors.ImageBanner.LangZhtwBehavior,
	D2L.PolymerBehaviors.ImageBanner.LangZhBehavior
];
