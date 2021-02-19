define(function() {
    return {
        jsonToStr: function(ops) {
            let data = ops.data || {};
            let connector = ops.connector || '='; // 联接符
            let separator = ops.separator || '&'; // 分隔符
            let str = ops.base || '';
            for (const key in data) {
                str += key + connector + data[key] + separator;
            }
            str = str.substring(0, str.length - separator.length);
            let suffix = ops.suffix || '';
            return str + suffix;
        }
    }
})
