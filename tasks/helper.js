'use strict';
module.exports = {
    writeWechatData: function (value) {
        let x2js = new X2JS();

        let font = JSON.stringify(x2js.xml2js(grunt.file.read('assets/fonts/neusa_shadow.xml')));
        let tls = grunt.file.read('assets/atlases/interface.json');
        let tls2 = grunt.file.read('assets/atlases/boostAnimation.json');

        var data;
        // = 'window.font = ' + JSON.stringify(font) + '; \n' +
        //     'window.boostanimation = ' + JSON.stringify(tls2) + '; \n' +
        //     'window.interface = ' + JSON.stringify(tls) + ';';
        switch (value) {
            case 'font':
                data = JSON.stringify(font);
                break;
            case 'boostanimation':
                data = tls2;
                break;
            case 'interface':
                data = tls;
                break;
        }
        return data;
    }
};

