define(function() {
    const ls = window.localStorage;
    return {
        get: function(key) {
            let res = ls.getItem(key);
            if (!res) {
                return null;
            }
            let obj = JSON.parse(res);
            if (obj.expirse && new Date().getTime() > obj.expirse) {
                ls.removeItem(key);
            } else {
                return obj.value;
            }
            return null;
        },
        set: function(key, value, expirse) {
            let obj = {
                value
            };
            if (typeof expirse == 'number') {
                obj.expirse = new Date().getTime() + expirse * 1000;
            } else if (expirse instanceof Date) {
                obj.expirse = expirse.getTime();
            }
            ls.setItem(key, JSON.stringify(obj));
        },
        remove: function(key) {
            ls.removeItem(key);
        },
        clearAll: function() {
            ls.clear();
        }
    }
})
