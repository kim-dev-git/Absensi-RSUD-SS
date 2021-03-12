import {
    db,
    serverTimestamp,
    GeoPoint,
    arrayUnion,
} from "../services/firebase";
import geolocation from "../services/geolocation";
import { toCollectionDate, startOfMonth, endOfMonth } from "../filters/date";

const END_POINT = "attendances";
const ref = db.collection(END_POINT);
const qrGeneratorRef = db.collection("qrGenerator");

const state = {
    currentQrCode: null,
    qrCodeData: null,
    userAttendances: [],
    todayAttendances: [],
    listenerTodayAttendances: [],
    todayAttendanceLogs: [],
    monthlyAttendances: [],
    detailAttendances: [],
};

const getters = {
    listenerTodayAttendancesPresent: (state) => {
        let attendances = state.listenerTodayAttendances;
        let filterValue = "Masuk";
        let presentAttendances = attendances.filter(
            (attendance) => attendance.type === filterValue
        );

        return presentAttendances;
    },

    listenerTodayAttendancesReturn: (state) => {
        let attendances = state.listenerTodayAttendances;
        let filterValue = "Pulang";
        let returnAttendances = attendances.filter(
            (attendance) => attendance.type === filterValue
        );

        return returnAttendances;
    },

    sortedDetailAttendances: (state) => {
        let detailAttendances = state.detailAttendances;
        let sortedDetailAttendances = detailAttendances.sort(
            (a, b) => a.createdAt > b.createdAt
        );

        return sortedDetailAttendances;
    },

    filteredDetailAttendances: (state) => {
        let detailAttendances = state.detailAttendances;
        let filteredDetailAttendances = [];

        detailAttendances.map((attendance) => {
            let { uid, displayName, photoURL, createdAt, type } = attendance;
            let foundUID = filteredDetailAttendances.findIndex(
                (attendance) => attendance.uid == uid
            );

            if (foundUID >= 0) {
                let selectedAttendance = filteredDetailAttendances[foundUID];
                selectedAttendance.returnAt = createdAt;
            } else {
                let data = { uid, displayName, photoURL };

                if (type === "Masuk") {
                    data.presentAt = createdAt;
                }

                filteredDetailAttendances.push(data);
            }
        });

        return filteredDetailAttendances;
    },
};

const mutations = {
    SET_CURRENT_QR_CODE: (state, data) => {
        state.currentQrCode = data;
    },
    SET_QR_CODE_DATA: (state, data) => {
        state.qrCodeData = data;
    },
    SET_USER_ATTENDANCES: (state, data) => {
        state.userAttendances = data;
    },
    SET_TODAY_ATTENDANCE_LOGS: (state, data) => {
        state.todayAttendanceLogs = data;
    },
    SET_TODAY_ATTENDANCES: (state, data) => {
        state.todayAttendances = data;
    },
    SET_LISTENER_TODAY_ATTENDANCES: (state, data) => {
        state.listenerTodayAttendances = data;
    },
    SET_MONTHLY_ATTENDANCES: (state, data) => {
        state.monthlyAttendances = data;
    },
    SET_DETAIL_ATTENDANCES: (state, data) => {
        state.detailAttendances = data;
    },
};

const actions = {
    async generate({ commit, state, rootState }) {
        try {
            let batch = db.batch();
            let user = rootState.users.currentUser;
            let { latitude, longitude } = await geolocation;
            let location = new GeoPoint(latitude, longitude);
            let newQrCode = {
                generatorLocation: location,
                isScanned: false,
                createdAt: serverTimestamp(),
                // attendanceFor: user.attendanceFor,
                creatdByUID: user.uid,
                createdByDisplayName: user.displayName,
                createdByPhotoURL: user.photoURL,
            };
            let newKey = (await qrGeneratorRef.add({})).id;
            let newQrGeneratorRef = qrGeneratorRef.doc(newKey);
            let currentQrCode = state.currentQrCode;

            if (currentQrCode) {
                batch.delete(qrGeneratorRef.doc(currentQrCode));
            }
            batch.set(newQrGeneratorRef, newQrCode, { merge: true });
            batch.commit().then(() => {
                commit("SET_CURRENT_QR_CODE", newKey);
            });
        } catch (err) {
            console.log(err);
        }
    },

    async listener({ state, commit }) {
        let currentQrCode = state.currentQrCode;

        if (currentQrCode) {
            let unsubscribe = qrGeneratorRef
                .doc(currentQrCode)
                .onSnapshot((response) => {
                    if (!response.exists) {
                        unsubscribe();
                        return;
                    }

                    let data = response.data();
                    data.id = response.id;

                    commit("SET_QR_CODE_DATA", data);
                });
        }
    },

    async listenerTodayAttendances({ commit }) {
        let todayToId = toCollectionDate(new Date());
        let todayRef = ref.doc(todayToId).collection("logs");
        let unsubscribe;

        if (todayToId) {
            unsubscribe = todayRef
                .orderBy("createdAt", "desc")
                .onSnapshot((response) => {
                    let { docs } = response;
                    let listenerTodayAttendances = [];

                    docs.map((doc) => {
                        let data = {
                            id: doc.id,
                            ...doc.data(),
                        };

                        listenerTodayAttendances.push(data);
                    });

                    commit(
                        "SET_LISTENER_TODAY_ATTENDANCES",
                        listenerTodayAttendances
                    );
                });
        }

        return unsubscribe;
    },

    async checkQrCode({ rootState, commit }, qrcode) {
        let qrRef = qrGeneratorRef.doc(qrcode);
        let query = await qrRef.get();

        if (!query.exists) {
            alert("Kode QR Expired.");
            console.log("Kode QR Expired.");
            return;
        }

        let qrCodeData = query.data();
        let { generatorLocation } = qrCodeData;
        let { longitude } = await geolocation;
        let maxDistance = 50;
        let isAffordableDistance =
            Math.abs(
                Math.round(generatorLocation.longitude) - Math.round(longitude)
            ) < maxDistance;

        if (!isAffordableDistance) {
            alert("Posisi anda terlalu jauh dari Komputer Absensi");
            return;
        }

        try {
            let batch = db.batch();
            let { uid, displayName, photoURL } = rootState.users.currentUser;
            let userRef = db.collection("users").doc(uid);
            let attendanceDateKey = toCollectionDate(new Date());
            let userAttendanceRef = db
                .collection(`users/${uid}/userAttendances`)
                .doc(attendanceDateKey);
            let attendanceRef = ref.doc(attendanceDateKey);
            let attendanceLogsRef = attendanceRef.collection("logs");
            let attendanceLogKey = (await attendanceLogsRef.add({})).id;
            let logRef = attendanceLogsRef.doc(attendanceLogKey);
            let updateQr = {
                isScanned: true,
                scannedByDisplayName: displayName,
                scannedByPhotoURL: photoURL,
            };
            let attendanceLogData = {
                uid,
                displayName,
                photoURL,
                numericDate: Number(attendanceDateKey),
                createdAt: serverTimestamp(),
            };
            let userLastAttendanceData = {};
            let attendanceData = {};
            let userAttendanceData = {};
            let isAlreadyPresent = false;
            let isAlreadyReturn = false;
            let attendanceType = null;
            let checkAttendanceQuery = await attendanceRef.get();

            if (checkAttendanceQuery.exists) {
                let data = checkAttendanceQuery.data();
                if (data && data.presents) {
                    await data.presents.map((userId) => {
                        if (userId === uid) isAlreadyPresent = true;
                    });
                }
                if (data && data.returns) {
                    await data.returns.map(async (userId) => {
                        if (userId === uid) isAlreadyReturn = true;
                    });
                }
            }

            if (isAlreadyReturn) {
                alert("Anda sudah melakukan absen pulang");
                await logRef.delete();
                return;
            } else {
                if (isAlreadyPresent) {
                    userLastAttendanceData = {
                        lastReturnId: attendanceDateKey,
                    };
                    userAttendanceData = {
                        returnAt: serverTimestamp(),
                    };
                    attendanceData = {
                        returns: arrayUnion(uid),
                    };
                    attendanceLogData = {
                        type: "Pulang",
                        ...attendanceLogData,
                    };
                    attendanceType = "Pulang";
                } else {
                    userLastAttendanceData = {
                        lastPresentId: attendanceDateKey,
                    };
                    userAttendanceData = {
                        presentAt: serverTimestamp(),
                    };
                    attendanceData = {
                        presents: arrayUnion(uid),
                    };
                    attendanceLogData = {
                        type: "Masuk",
                        ...attendanceLogData,
                    };
                    attendanceType = "Masuk";
                }
            }

            userAttendanceData = {
                ...userAttendanceData,
                uid,
                displayName,
                photoURL,
                jobTitle: rootState.users.currentUser.jobTitle || null,
                numericDate: Number(attendanceDateKey),
            };

            batch.set(qrRef, updateQr, { merge: true });
            batch.set(logRef, attendanceLogData, { merge: true });
            batch.set(
                attendanceRef,
                { numericDate: Number(attendanceDateKey), ...attendanceData },
                { merge: true }
            );
            batch.set(userAttendanceRef, userAttendanceData, { merge: true });
            batch.set(userRef, userLastAttendanceData, { merge: true });

            await batch.commit().catch(async () => await logRef.delete());

            commit(
                "users/SET_CURRENT_USER",
                {
                    ...rootState.users.currentUser,
                    ...userLastAttendanceData,
                },
                { root: true }
            );

            console.log(`Absen ${attendanceType} berhasil`);
            alert(`Absen ${attendanceType} berhasil`);
        } catch (err) {
            console.log(err);
            alert(err);
        }
    },

    async getUserAttendances({ commit }, uid) {
        try {
            let query = await db
                .collection(`users/${uid}/userAttendances`)
                .get();

            let { docs } = query;
            let userAttendances = [];

            docs.map((doc) => {
                var attendance = {
                    id: doc.id,
                    ...doc.data(),
                };

                userAttendances.push(attendance);
            });

            commit("SET_USER_ATTENDANCES", userAttendances);
        } catch (err) {
            console.error(err);
        }
    },

    async getTodayAttendanceLogs({ commit }) {
        try {
            let todayToId = toCollectionDate(new Date());
            let todayRef = ref.doc(todayToId).collection("logs");
            let query = todayRef.orderBy("createdAt", "desc");
            let { docs } = await query.get();
            let todayAttendanceLogs = [];

            docs.map((doc) => {
                var attendance = {
                    id: doc.id,
                    ...doc.data(),
                };

                todayAttendanceLogs.push(attendance);
            });

            commit("SET_TODAY_ATTENDANCE_LOGS", todayAttendanceLogs);
        } catch (err) {
            console.error(err);
        }
    },

    async getTodayAttendances({ commit }) {
        try {
            let todayToId = toCollectionDate(new Date());
            let todayAttendancesRef = db.collectionGroup("userAttendances");
            let query = todayAttendancesRef.where(
                "numericDate",
                "==",
                Number(todayToId)
            );
            let { docs } = await query.get();
            let todayAttendances = [];

            docs.map((doc) => {
                let attendance = {
                    id: doc.id,
                    ...doc.data(),
                };
                todayAttendances.push(attendance);
            });

            commit("SET_TODAY_ATTENDANCES", todayAttendances);
        } catch (err) {
            console.error(err);
        }
    },

    async getMonthlyAttendances({ commit }, { startOfMonth, endOfMonth }) {
        try {
            let query = ref
                .where("numericDate", ">=", Number(startOfMonth))
                .where("numericDate", "<=", Number(endOfMonth))
                .orderBy("numericDate", "asc");

            let { docs } = await query.get();
            let monthlyAttendances = [];

            docs.map((doc) => {
                var attendance = {
                    id: doc.id,
                    ...doc.data(),
                };

                monthlyAttendances.push(attendance);
            });

            commit("SET_MONTHLY_ATTENDANCES", monthlyAttendances);
        } catch (err) {
            console.error(err);
        }
    },

    async getDetailAttendances({ commit }, numericDate) {
        try {
            let query = db
                .collection(`attendances/${numericDate}/logs`)
                .orderBy("createdAt", "asc");

            let { docs } = await query.get();
            let detailAttendances = [];

            docs.map((doc) => {
                var attendance = {
                    id: doc.id,
                    ...doc.data(),
                };

                detailAttendances.push(attendance);
            });

            commit("SET_DETAIL_ATTENDANCES", detailAttendances);
        } catch (err) {
            console.error(err);
        }
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
