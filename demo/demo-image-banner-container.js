import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="demo-image-banner-container">
	<template strip-whitespace="">
		<style>
			:host {
				display: block;
			}

			.demo-image-banner-container {
				height: 200px;
				max-width: 100%;
				position: relative;
			}

			.demo-image-banner-container-banner {
				align-items: center;
				background: lightblue;
				bottom: 0;
				display: flex;
				left: 0;
				overflow: hidden;
				position: absolute;
				right: 0;
				top: 0;
				width: 1170px;
			}

			.demo-image-banner-container-image {
				background: linear-gradient(135deg, #49c0f0 8%,#235d72 23%,#ffffff 41%,#a33299 52%,#040709 74%,#9540ce 90%,#2f7f19 100%);
				height: 100%;
				transition: opacity 1s;
				width: 100%;
			}

			@media (max-width: 1170px) {
				.demo-image-banner-container-image {
					margin-left: calc((100vw - 1170px) / 2);
				}
			}
			@media (min-width: 1170px) {
				.demo-image-banner-container {
					margin: 0 auto;
					width: 1170px;
				}
			}
		</style>
		<div class="demo-image-banner-container">
			<slot></slot>
			<div class="demo-image-banner-container-banner">
				<div class="demo-image-banner-container-image"></div>
			</div>
		</div>
	</template>
	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'demo-image-banner-container'
});
