var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

const location = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            let result = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
            };
            resolve(result);
        },
        error,
        options
    );
});

export default location;
