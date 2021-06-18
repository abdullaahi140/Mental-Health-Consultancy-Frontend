const CracoLessPlugin = require('craco-less');

module.exports = {
	plugins: [
		{
			plugin: CracoLessPlugin,
			options: {
				lessLoaderOptions: {
					lessOptions: {
						modifyVars: {
							'@layout-header-background': '#FFFFFF;',
							'@primary-color': '#0057A8',
							'@success-color': '#2D6510',
							'@error-color': '#B30003'
						},
						javascriptEnabled: true
					}
				}
			}
		}
	]
};
