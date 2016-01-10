module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            build: ['Gruntfile.js', 'src/fine.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        uglify: {
            build: {
                src: 'src/fine.js',
                dest: 'dist/fine.min.js'
            }
        },

        watch: {
            build: {
                files: ['src/fine.js'],
                tasks: ['jshint', 'uglify'],
                options: {spawn: false}
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'uglify', 'watch']);
};