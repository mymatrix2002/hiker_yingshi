const csdown = {
    d: [],
    author: '流苏',
    version: '0',
    home: function() {
        var d = this.d;
        d.push({
            title: 'APP站长已跑路,请自行删除',
            url: 'hiker://empty',
            col_type: 'text_1',
        })
        setResult(d)
    },
}
$.exports = csdown
