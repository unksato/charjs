module.exports = function(grunt){

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');

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
            },
            test: {
                src: ["src/**/*.ts", "test/**/*.ts"],
                options : {
                    module : 'amd',
                    target : 'es5',
                    sourceMap : true,
                    experimentalDecorators : true
                }
            },
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
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
                src: ['dist/*', 'src/**/*.js', 'src/**/*.js.map', 'test/**/*.js', 'test/**/*.js.map','output/*' ]
            }
        }
    });

    grunt.registerTask('build',['clean','ts','uglify']);
    grunt.registerTask('test',['clean','ts:test','karma']);

}