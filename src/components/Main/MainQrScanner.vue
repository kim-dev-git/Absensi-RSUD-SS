<template>
    <v-dialog
        v-model="show"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
    >
        <v-sheet height="100vh">
            <div class="fullscreen" ref="wrapper">
                <qrcode-stream v-if="show" @init="onInit" @decode="onDecode">
                    <v-layout
                        v-if="loading"
                        column
                        style="width: 100vw; height: 100vh;"
                        class="align-center justify-center"
                    >
                        <v-progress-circular indeterminate />
                    </v-layout>
                    <v-footer fixed padless>
                        <v-btn
                            block
                            large
                            v-text="'Batal'"
                            @click="show = false"
                        />
                    </v-footer>
                </qrcode-stream>
            </div>
        </v-sheet>
    </v-dialog>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";
export default {
    components: {
        QrcodeStream,
    },

    props: {
        value: Boolean,
    },

    data: () => ({
        loading: false,
    }),

    computed: {
        show: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit("input", value);
            },
        },
    },

    methods: {
        requestFullscreen() {
            const elem = this.$refs.wrapper;

            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                /* IE/Edge */
                elem.msRequestFullscreen();
            }
        },

        async onInit(promise) {
            this.loading = true;
            let errorMessage = "";

            try {
                await promise;
                // this.requestFullscreen();
            } catch (error) {
                if (error.name === "NotAllowedError") {
                    errorMessage =
                        "ERROR: you need to grant camera access permisson";
                } else if (error.name === "NotFoundError") {
                    errorMessage = "ERROR: no camera on this device";
                } else if (error.name === "NotSupportedError") {
                    errorMessage =
                        "ERROR: secure context required (HTTPS, localhost)";
                } else if (error.name === "NotReadableError") {
                    errorMessage = "ERROR: is the camera already in use?";
                } else if (error.name === "OverconstrainedError") {
                    errorMessage = "ERROR: installed cameras are not suitable";
                } else if (error.name === "StreamApiNotSupportedError") {
                    errorMessage =
                        "ERROR: Stream API is not supported in this browser";
                }

                console.log(errorMessage);
            } finally {
                this.loading = false;
            }
        },

        onDecode(result) {
            this.$emit("decode", result);
        },
    },
};
</script>

<style scoped>
.fullscreen {
    position: fixed;
    z-index: 1000;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
}
</style>
