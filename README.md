
` $ pageparser http://example.com/ "h1" :content `
` $ pageparser "h1" :html < tests\testpage.html `
` $ cat tests\testpage.html | pageparser "h1" :html `
