define(['md5', './storage.js', './utils.js'], function(md5, $storage, $utils) {
    const defaultOpt = {
        login: false,
        timeout: 20
    };
    function baseRequest(options) {
        const {
            url,
            method,
            params,
            data,
            cache,
            files,
            timeout
        } = options;
        console.log(URL + '/api/' + url)
        return new Promise((resolve, reject) => {
            api.ajax({
                url: URL + '/api/' + url,
                method,
                data: {
                    values: method == 'get' ? params : data,
                    files
                },
                timeout: timeout,
            }, (res) => {
                if (!res) {
                    return reject({
                        msg: "请求失败"
                    });
                }
                if ([0].indexOf(res.status) !== -1) {
                    return reject(res);
                } else {
                    setApiCache(cache, res, method, url, params);
                    resolve(res);
                }
            });
        })
    }

    function setApiCache(cache, data, method, url, params) {
        if (!cache || method != 'get') return;
        let key = getApiCacheKey(url, params);
        $storage.set(key, data, cache)
    }

    function getApiCacheKey(url, params) {
        let cacheKey = $utils.jsonToStr({
            base: _config.baseURL + url + '?',
            data: params
        });
        return 'api_cache_' + md5(cacheKey);
    }

    const request = ["post"].reduce((request, method) => {
        request[method] = (url, data = {}, options = {}) => {
            return baseRequest(
                Object.assign({
                    url,
                    data,
                    method
                }, defaultOpt, options)
            );
        };
        return request;
    }, {});

    ["get"].forEach(method => {
        request[method] = (url, params = {}, options = {}) => {
            const {
                cache
            } = options;
            if (cache && method == 'get') {
                let key = getApiCacheKey(url, params);
                let res = $storage.get(key);
                if (res) return Promise.resolve(res);
            }
            return baseRequest(
                Object.assign({
                    url,
                    params,
                    method
                }, defaultOpt, options)
            );
        };
    });
    return request;
});
