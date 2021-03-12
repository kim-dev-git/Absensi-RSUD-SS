import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                // primary: '#6C5DD3',
                // info: '#0049C6',
                // error: '#D32F2F',
                // warning: '#FFCE73',
                // navbar: '#FFF',
                base: "#F1F3F4",
            },
            dark: {
                //
            },
        },
    },
});
