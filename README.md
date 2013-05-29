# Web Resource Loader

javascript and css loader

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com//wrl/master/dist/wrl.min.js
[max]: https://raw.github.com//wrl/master/dist/wrl.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.wrl.min.js"></script>
<script>
jQuery(function($) {
  $.wrl.addLoader({	name: '... loader name ...',
													config: {
														js: { ... javascript resources ... },
														css:{ ... css resources ... },
														html:{ ... static get resources ... }
													}
	});
});
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
