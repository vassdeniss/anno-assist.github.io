const storageVersion = '1';
const userDataName = 'userData';


const userData = createStorage(userDataName);
export const getUserData = userData.get;
export const setUserData = userData.set;
export const clearUserData = userData.clear;

export function createStorage(name, defaultValue = null) {
    if (name != userDataName && localStorage.getItem(`${name}_version`) != storageVersion) {
        localStorage.removeItem(name);
        localStorage.setItem(`${name}_version`, storageVersion);
    }
    let data;

    return {
        get: () => {
            if (data == undefined) {
                const value = localStorage.getItem(name);
                try {
                    data = JSON.parse(value);
                } catch (err) {
                    localStorage.removeItem(name);
                    data = null;
                }
            }
            return data || defaultValue;
        },
        set: (value) => {
            data = value;
            localStorage.setItem(name, JSON.stringify(value));
        },
        clear: () => {
            data = undefined;
            localStorage.removeItem(name);
        }
    };
}

export function createSubmitHandler(callback) {
    return function (event) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries([...formData.entries()].map(([k, v]) => {
            v = v.trim();
            if (k != 'password' && k != 'repass') {
                const asNumber = Number(v);
                if (Number.isFinite(asNumber)) {
                    v = asNumber;
                }
            }
            return [k, v];
        }));

        callback(data, form);
    };
}

const urlPattern = /[^A-Za-z0-9]/g;

export function createUrl(name) {
    return name.replace(urlPattern, () => '-');
}

export function percent(value, rate) {
    return value * rate / 100;
}

export function popRate(value, rate) {
    return Math.floor(percent(value, rate));
}

export function round(value, precision) {
    return Math.round(value * 10 ** precision) / 10 ** precision;
}

export function throttle(fn, delay) {
    let timer = null;

    const result = function (...params) {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            fn(...params);
        }, delay);

        result.commit = () => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
                fn(...params);
            }
        };
    };

    return result;
}