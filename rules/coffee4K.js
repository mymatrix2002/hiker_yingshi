const csdown = {
    d: [],
    author: '流苏',
    version: '0',
    rely: function(data) {
        return data.match(/\{([\s\S]*)\}/)[0].replace(/\{([\s\S]*)\}/, '$1')
    },
    home: function() {
        var d = this.d;
        confirm({
            title: '更新',
            content: '是否导入剧圈小程序？',
            confirm: $.toString(() => {
                return parsePaste('云6oooole/xxxxxx/ihrnuabo4vx8l2cm@XveEVl')
            }),
            cancel: $.toString(() => {})
        })
        if (!getItem('up' + this.version, '')) {
            this.update()
            setItem('up' + this.version, '1')
        }
        d.push({
            title: '已失效,请自行删除',
            url: 'hiker://empty',
            col_type:'text_1',
        })
        setResult(d)
    },
    update: function() {
        if (getMyVar('github_url') == '') {
            for (let item of storage0.getItem('githubapi')) {
                let data = JSON.parse(fetch(item, {
                    withStatusCode: true,
                    timeout: 5000,
                }));
                if (data.statusCode == 200) {
                    putMyVar('github_url', item + '/');
                    break;
                }
            }
        }
        const hikerPop = $.require(getMyVar('github_url') + "https://raw.githubusercontent.com/csdown/hiker_yingshi/refs/heads/main/rules/hikerPop.js");
        let pop = hikerPop.updateRecordsBottom([{
            title: "声明",
            records: [
                "““声明””:本小程序完全免费,别被骗了",
                "““声明””:随时可能跑路",
                "““声明””:不要相信里面的广告，不要去加里面的群",
            ]
        }, {
            title: "2025/07/23",
            records: [
                "““更新””：coffee4K已失效，请自行删除",
            ]
        }, {
            title: "2025/07/18",
            records: [
                "““更新””：更新至APP最新版，修复内容失效",
            ]
        }, {
            title: "2025/07/11",
            records: [
                "““修复””：修复页面无内容",
            ]
        }, {
            title: "2025/06/28",
            records: [
                "““修复””：修复一个bug",
            ]
        }, {
            title: "2025/06/25",
            records: [
                "““更新””：更换二级页面线路切换方式，改为刷新元素，而非刷新页面(其实没什么区别)",
                "““更新””：更换分类折叠方式，改为刷新元素，而非刷新页面",
            ]
        }, {
            title: "2025/06/15",
            records: [
                "““更新””:更新APP版本号至最新",
                "““修复””:修复无法观看问题",
                "““更新””:去除广告控件，广告防不胜防，不要信广告，不要去加群",
                '““以后随缘修，不会更的这么勤，主要是没啥动力，更这个不如自己玩””'
            ]
        }, {
            title: "2025/06/14",
            records: [
                "““更新””:去广告",
                "““更新””:分类加个折叠",
            ]
        }, {
            title: "2025/06/13",
            records: [
                "““修复””:修bug",
            ]
        }, {
            title: "2025/06/09",
            records: [
                "““修复””:修复官方解析线路无法播放问题",
            ]
        }, {
            title: "2025/06/07",
            records: [
                "““修复””:修复部分线路无法播放问题",
            ]
        }, {
            title: "2025/06/05",
            records: [
                "““更新””:轮播有广告，直接去掉算了",
            ]
        }, {
            title: "2025/06/04",
            records: [
                "““修复””:修复历史记录无法查看",
                "““修复””:修复部分BUG",
                "““更新””:长按首页查看更新日志",
            ]
        }, {
            title: "2025/06/02",
            records: [
                "‘‘更新’’:去除轮播广告",
                "‘‘修复’’:修复秒播线路播放问题"
            ]
        }]);
    },
}
$.exports = csdown
