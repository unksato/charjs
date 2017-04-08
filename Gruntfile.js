module.exports = function(grunt){

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({

        ts: {
            default: {
                src: ["src/**/*.ts"],
                out: "dist/mario.js",
                options : {
                    module : 'amd',
                    target : 'es5',
                    sourceMap : true,
                    experimentalDecorators : true
                }
            }
        },

        uglify: {
            default: {
                options : {
                    sourceMap: 'dist/mario.min.js.map',
                    sourceMapRoot: '',
                    sourceMappingURL: 'mario.min.js.map',
                    sourceMapIn: 'dist/mario.js.map',
                    sourceMapPrefix: 1
                },
                files: {
                    'dist/mario.min.js' : ['dist/mario.js']
                }
            }
        },

        clean: {
            default: {
                src: ['dist/*', 'src/**/*.js', 'src/**/*.js.map' ]
            }
        }
    });

    grunt.registerTask('build',['clean','ts','uglify']);

}