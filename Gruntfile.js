module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks("grunt-tslint");

    grunt.initConfig({

        ts: {
            default: {
                src: ["src/**/*.ts","!src/bookmarklet/**"],
                out: "dist/mario.js",
                options: {
                    module: 'amd',
                    target: 'es5',
                    sourceMap: true,
                    experimentalDecorators: true
                }
            },
            mario: {
                src: "src/bookmarklet/mario_world.ts",
                out: "bookmarklet/mario_world.js",
                options: {
                    module: 'amd',
                    target: 'es5'
                }                
            },
            myq: {
                src: ["src/util/deferred.ts", "src/util/promise.ts"],
                out: "dist/myq.js",
                options: {
                    module: 'amd',
                    target: 'es5',
                    sourceMap: true,
                    experimentalDecorators: true
                }
            },
            test: {
                src: ["src/**/*.ts", "test/**/*.ts"],
                options: {
                    module: 'amd',
                    target: 'es5',
                    sourceMap: true,
                    experimentalDecorators: true
                }
            },
        },

        tslint: {
            options: {
                configuration: 'tslint.json'
            },
            default: {
                src: ['src/**/*.ts']
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        uglify: {
            default: {
                options: {
                    sourceMap: 'dist/mario.min.js.map',
                    sourceMapRoot: '',
                    sourceMappingURL: 'mario.min.js.map',
                    sourceMapIn: 'dist/mario.js.map',
                    sourceMapPrefix: 1
                },
                files: {
                    'dist/mario.min.js': ['dist/mario.js']
                }
            }
        },

        clean: {
            default: {
                src: ['dist/*', 'src/**/*.js', 'src/**/*.js.map', 'test/**/*.js', 'test/**/*.js.map', 'output/*']
            }
        },
        coveralls: {
            options: {
                force: false
            },
            base: {
                src: 'output/ts-coverage/lcov.info'
            }
        }
    });

    grunt.registerTask('build', ['clean', 'ts:default', 'uglify']);
    grunt.registerTask('test', ['clean', 'ts:test', 'karma']);

}