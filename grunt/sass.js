module.exports = {
        sass: { 
        	options: {
        		style: 'compressed'
        	},                            // target
            files: {                        // dictionary of files
                'dist/production.css': 'app/sass/main.scss'     // 'destination': 'source'
            }
        }  
}
