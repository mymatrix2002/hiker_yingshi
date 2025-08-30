const csdown = {
    d: [],
    d_: [],
    author: '流苏',
    version: '20250830',
    home: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = getParam('page');
        if (MY_PAGE == 1) {
            try {
                if (!getItem('up' + this.version, '')) {
                    this.update()
                    setItem('up' + this.version, '1')
                }
            } catch (e) {
                toast('未获取到远程数据，请连接代理后重试')
                log(e.message)
            }
            d_.push({   
                title: "搜索 ",
                url: $.toString(() => {
                    putMyVar('keyword', input);
                    return 'hiker://empty?page=fypage&#gameTheme#@rule=js:$.require("csdown").search()';
                }),
                   desc: "请输入搜索关键词",
                   col_type: "input",
                extra: {
                    onChange: $.toString(() => {
                        putMyVar('keyword', input)
                    }),
                    defaultValue: getMyVar('keyword', ''),
                }
            })
            let 首页 = [{
                title: '发现&首页&视频',
                id: '1&2&3&4&5',
                img: 'https://images.jjawa.com/admin/202502130853510new.jpg&https://images.jjawa.com/admin/202502130853420new.jpg&https://images.jjawa.com/admin/202502130854737new.jpg&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/48.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/109.png'
            }];
            let longclick = [{
                title: '更新日志',
                js: $.toString(() => {
                    $.require("csdown").update()
                })
            }]
            this.Cate(首页, '首页', d_, 'icon_small_3', longclick);
            d_.push({
                col_type: 'big_blank_block',
            });
            setPreResult(d_)
        }
        let 分类 = getMyVar('首页', '1');
        if (分类 == 1) {
            this.findvideo()
        } else if (分类 == 2) {
            this.cate()
        } else if (分类 == 3) {
            this.microvod()
        }
        deleteItem("loading_");
        setResult(d)
    },
    color: function(txt) {
        return '<b><font color=' + '#FF6699' + '>' + txt + '</font></b>'
    },
    strong: function(d, c) {
        return '‘‘’’<strong><font color=#' + (c || '000000') + '>' + d + '</font></strong>';
    },
    sha1: function(str) {
        eval(getCryptoJS());
        return CryptoJS.SHA1(str).toString();
    },
    addressTag: function(url, text) {
        return "<a href='" + url + "'>" + text + "</a>";
    },
    Cate: function(list, n, d, col, longclick) {
        if (!col) {
            col = 'scroll_button';
        }
        if (!longclick) {
            longclick = [];
        }
        var index_n = list[0].id.split('&')[0] + '';
        list.forEach(data => {
            var title = data.title.split('&');
            var id = data.id.split('&');
            if (data.img != null) {
                var img = data.img.split('&');
            } else {
                var img = [];
            }
            title.forEach((title, index) => {
                d.push({
                    title: (getMyVar(n, index_n) == id[index] ? (col == 'icon_small_3' ? this.color(title) : this.strong(title, 'FF6699')) : title),
                    img: img[index],
                    url: $('#noLoading#').lazyRule((n, title, id) => {
                        putMyVar(n, id);
                        refreshPage(false);
                        return 'hiker://empty';
                    }, n, title, id[index] + ''),
                    col_type: col,
                    extra: {
                        longClick: longclick,
                        backgroundColor: getMyVar(n, index_n) == id[index] ? "#20FA7298" : "",
                    }
                })
            })
            d.push({
                col_type: 'blank_block',
            });
        })
        return d;
    },
    Decrypt: function(word, key_, iv_) {
        eval(getCryptoJS())
        const key = CryptoJS.enc.Utf8.parse(key_);
        const iv = CryptoJS.enc.Utf8.parse(iv_);
        let encryptedHexStr = CryptoJS.enc.Base64.parse(word);
        let decrypt = CryptoJS.AES.decrypt({
            ciphertext: encryptedHexStr
        }, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr;
    },
    Decrypt_Hex: function(word, key_, iv_) {
        eval(getCryptoJS())
        const key = CryptoJS.enc.Utf8.parse(key_);
        const iv = CryptoJS.enc.Utf8.parse(iv_);
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        let decrypt = CryptoJS.AES.decrypt({
            ciphertext: encryptedHexStr
        }, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr;
    },
    // 加密函数
    Encrypt: function(plaintext, key_, iv_) {
        eval(getCryptoJS())
        const key = CryptoJS.enc.Utf8.parse(key_);
        const iv = CryptoJS.enc.Utf8.parse(iv_);
        var encrypted = CryptoJS.AES.encrypt(plaintext, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        var ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
        return ciphertext;
    },
    rsa_en: function(data) {
        let rsakey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUM5+/y8sPsWkd1/RQS64X259EUwxFXFE5HlA65MqrxnPs0JqoSRojSDy5QhwvROlaD6TwRQHKMY2OAZ6SnQeUJsChTEFIR9qUkwrs3/MVUMxjsv6JS6Oe/juclyJGTgVmDhB55EafXsD0SQYVj/QXXsxR6ewR5E2kL52yAAD4yQIDAQAB";
        let options = {
            config: "RSA/ECB/PKCS1Padding",
            type: 1,
            long: 2,
            block: true
        }
        let data_en = rsaEncrypt(data, rsakey, options);
        return data_en;
    },
    rsa_de: function(data) {
        let rsakey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGAe6hKrWLi1zQmjTT1ozbE4QdFeJGNxubxld6GrFGximxfMsMB6BpJhpcTouAqywAFppiKetUBBbXwYsYU1wNr648XVmPmCMCy4rY8vdliFnbMUj086DU6Z+/oXBdWU3/b1G0DN3E9wULRSwcKZT3wj/cCI1vsCm3gj2R5SqkA9Y0CAwEAAQKBgAJH+4CxV0/zBVcLiBCHvSANm0l7HetybTh/j2p0Y1sTXro4ALwAaCTUeqdBjWiLSo9lNwDHFyq8zX90+gNxa7c5EqcWV9FmlVXr8VhfBzcZo1nXeNdXFT7tQ2yah/odtdcx+vRMSGJd1t/5k5bDd9wAvYdIDblMAg+wiKKZ5KcdAkEA1cCakEN4NexkF5tHPRrR6XOY/XHfkqXxEhMqmNbB9U34saTJnLWIHC8IXys6Qmzz30TtzCjuOqKRRy+FMM4TdwJBAJQZFPjsGC+RqcG5UvVMiMPhnwe/bXEehShK86yJK/g/UiKrO87h3aEu5gcJqBygTq3BBBoH2md3pr/W+hUMWBsCQQChfhTIrdDinKi6lRxrdBnn0Ohjg2cwuqK5zzU9p/N+S9x7Ck8wUI53DKm8jUJE8WAG7WLj/oCOWEh+ic6NIwTdAkEAj0X8nhx6AXsgCYRql1klbqtVmL8+95KZK7PnLWG/IfjQUy3pPGoSaZ7fdquG8bq8oyf5+dzjE/oTXcByS+6XRQJAP/5ciy1bL3NhUhsaOVy55MHXnPjdcTX0FaLi+ybXZIfIQ2P4rb19mVq1feMbCXhz+L1rG8oat5lYKfpe8k83ZA==";
        let options = {
            config: "RSA/ECB/PKCS1Padding",
            type: 1,
            long: 1,
            block: true
        }
        let data_de = rsaDecrypt(data, rsakey, options);
        return JSON.parse(data_de);
    },
    post: function(url, request_key) {
        let t = Math.floor(Date.now() / 1000) + '';
        let token = getItem('token', '') || '';
        let keys = this.rsa_en('{"iv":"rCMNwZASNBKZ8mXV","key":"OITxa5OqAYjhswxx"}');
        request_key = this.Encrypt(request_key || '{}', 'OITxa5OqAYjhswxx', 'rCMNwZASNBKZ8mXV');
        let signature = md5('token_id=,token=' + token + ',phone_type=1,request_key=' + request_key + ',app_id=1,time=' + t + ',keys=' + keys + '*&zvdvdvddbfikkkumtmdwqppp?|4Y!s!2br');
        let body = 'token=' + token + '&token_id=&phone_type=1&time=' + t + '&phone_model=xiaomi-25031&keys=' + keys + '&request_key=' + request_key + '&signature=' + signature.toUpperCase() + '&app_id=1&ad_version=1';
        let html = JSON.parse(fetch(getItem('host') + url, {
            headers: {
                'code': 'GZ0369',
                'deviceId': getItem('deviceId'),
                'lang': 'zh_cn',
                'Cache-Control': 'no-cache',
                'Version': '2506030',
                'PackageName': 'com.eb02f73729.bdd0c986e4.t721f00a9d20250830',
                'Ver': '3.0.2.0',
                'api-ver': '3.0.2.0',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body,
            method: 'POST',
        })).data;
        let keys_ = this.rsa_de(html.keys);
        let response_key_ = this.Decrypt_Hex(html.response_key, keys_.key, keys_.iv)
        return JSON.parse(response_key_);
    },
    setDesc: function(d, desc, num) {
        //log(desc)
        if (desc == undefined) {
            return;
        }
        desc = desc.constructor == Array ? desc.join('<br>') : desc;
        if (desc.replace(/(<br>|\s+|<\/?p>|&nbsp;)/g, '').length == 0) {
            return;
        }
        const mark = 'desc';
        num = typeof(num) == 'undefined' ? 45 : num
        desc = desc.startsWith('　　') ? desc : '　　' + desc;
        desc = desc.replace(/'/g, "&#39;");
        desc = desc.replace(/\r\n/g, "<br>");
        desc = desc.replace(/\r/g, "<br>");
        desc = desc.replace(/\n/g, "<br>").replace(/[<p>|</p>]/g, "");

        function substr(str, maxLength) {
            let len = 0;
            for (let i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    len += 2;
                } else {
                    len++;
                }
                if (len > maxLength) {
                    return str.slice(0, i) + '...';
                }
            }
            return str;
        }
        let sdesc = substr(desc, num);
        var colors = {
            show: "black",
            hide: "grey"
        }
        var lazy = $(`#noLoading#`).lazyRule((dc, sdc, m, cs) => {
            var show = storage0.getItem(m, '0');
            var title = findItem('desc').title;
            var re = /(<\/small><br>.*?>).+/g;
            var exp = '展开:';
            var ret = '收起:';
            if (show == '1') {
                updateItem('desc', {
                    title: title
                        .replace(ret, exp)
                        .replace(re, '$1' + sdc + '</small>')
                        .replace(/(<\/small><br>\<font color=").*?(">)/, '$1' + cs.hide + '$2')
                })
                storage0.setItem(m, '0');
            } else {
                updateItem('desc', {
                    title: title
                        .replace(exp, ret)
                        .replace(re, '$1' + dc + '</small>')
                        .replace(/(<\/small><br>\<font color=").*?(">)/, '$1' + cs.show + '$2')
                })
                storage0.setItem(m, '1');
            }
            return `hiker://empty`
        }, desc, sdesc, mark, colors)
        var sc = storage0.getItem(mark, '0') == '0' ? '展开:' : '收起:';
        var dc = storage0.getItem(mark, '0') == '0' ? sdesc : desc;
        var cs = storage0.getItem(mark, '0') == '0' ? colors.hide : colors.show;
        d.push({
            title: '' + '<b><font color="#098AC1">∷剧情简介	</font></b>' + "<small><a style='text-decoration: none;' href='" + lazy + "'>" + sc + '</a></small><br><font color="' + cs + '">' + `${dc}` + '</small>',
            col_type: 'rich_text',
            extra: {
                id: 'desc',
                lineSpacing: 6,
                textSize: 15,
                lineVisible: true,
            }
        })
    },
    banner: function(title, start, arr, data, cfg) {
        let id = title + 'lunbo';
        var rnum = Math.floor(Math.random() * data.length);
        var item = data[rnum];
        putMyVar('rnum', rnum);
        let time = 5000;
        let col_type = 'pic_1_card';
        let color = "white";
        let desc = '';
        if (cfg != undefined) {
            time = cfg.time ? cfg.time : time;
            col_type = cfg.col_type ? cfg.col_type : col_type;
            desc = cfg.desc ? cfg.desc : desc;
        }

        arr.push({
            col_type: col_type,
            img: item.vod_pic,
            desc: desc,
            title: item.vod_name,
            url: $('hiker://empty?#immersiveTheme#').rule(() => {
                $.require("csdown").videoerji()
            }),
            extra: {
                id: id + 'bar',
                vod_id: item.vod_id,
                vod_name: item.vod_name,
            }
        })

        if (start == false || getMyVar('benstart', 'true') == 'false') {
            unRegisterTask(id)
            return
        }

        //log(data)

        let obj = {
            data: data,
        };

        registerTask(id, time, $.toString((obj, id, MY_PARAMS) => {
            var data = obj.data;
            var rum = getMyVar('rnum');

            var i = Number(getMyVar('banneri', '0'));
            if (rum != '') {
                i = Number(rum) + 1
                clearMyVar('rnum')
            } else {
                i = i + 1;
            }
            //log(i)
            //log(data.length)

            if (i > data.length - 1) {
                i = 0
            }
            var item = data[i];
            //log(item)
            try {
                updateItem(id + 'bar', {
                    title: item.vod_name,
                    img: item.vod_pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        $.require("csdown").videoerji()
                    }),
                    extra: {
                        //name: item.title.replace(/<[^>]+>/g, ''),
                        //sname: item.extra.sname,
                        //stype: item.extra.stype,
                        //surl: item.url,
                        //img:item.img,
                        //title: item.title.replace(/<[^>]+>/g, ''),
                        vod_id: item.vod_id,
                        vod_name: item.vod_name,

                    }
                })
            } catch (e) {
                log(e.message)
                unRegisterTask(id)
            }
            putMyVar('banneri', i);

        }, obj, id, MY_PARAMS))
    },
    update: function() {
        const hikerPop = $.require("https://raw.githubusercontent.com/csdown/hiker_yingshi/refs/heads/main/rules/hikerPop.js");
        let pop = hikerPop.updateRecordsBottom([{
            title: "声明",
            records: [
                "““声明””：本小程序完全免费,别被骗了",
                "““声明””：随时可能跑路",
                "““声明””：不要相信里面的广告",
                "““声明””：本小程序作者为““" + this.author + "””",
            ]
        }, {
            title: "2025/08/30",
            records: [
                "““更新””：优化页面",
            ]
        }, ]);
    },
    findvideo: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                if (!storage0.getMyVar('NewDiscover')) {
                    d_.push({
                        col_type: 'blank_block',
                        extra: {
                            id: 'blank_1',
                        }
                    }, {
                        img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                        url: "hiker://empty",
                        col_type: "pic_1_full",
                        extra: {
                            id: "loading_"
                        }
                    });
                    setPreResult(d_)
                }
                if (getMyVar('a', '') == '') {
                    /*
                    let api_url_list = JSON.parse(fetch('https://api.moe3dze.com/gz/initialize/getApiUrlList?parameter=key', {
                        headers: {
                            'client-version': '3.0.2.0',
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: 'parameter=',
                        method: 'POST',
                    }));
                    let api_list = JSON.parse(this.Decrypt(api_url_list.data, 'KANGEQIU@8868!~.', '0200010900030207'));
                    */
                    let api_list = ['https://api.w32z7vtd.com', 'https://api.yajfv2ph.com', 'https://api.txxhuc.com', 'https://api.cpcsfgyp.com', 'https://api.moe3dze.com', 'https://api.36kzbh85.com']
                    for (let item of api_list) {
                        let host = item;
                        let data = fetch(host + '/domain/check');
                        if (data == 'success') {
                            setItem('host', host);
                            log(host)
                            putMyVar('a', '1');
                            break;
                        }
                    }
                }
                d.push({
                    title: '““每日更新””',
                    img: 'https://seyouapp777.dzlndygh.com/i/2025/08/29/1000069041.png',
                    url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                        $.require('csdown').latestvideo();
                    }),
                    col_type: 'icon_1_left_pic',
                    extra: {
                        lineVisible: false
                    }
                })
                if (!getItem('token', '')) {
                    let random = 864150060000000 + Math.floor(Math.random() * 10000) + '';
                    setItem('deviceId', random);
                    let request_key = '{"new_key":"D0AF7BE2C461432C8EBDC3A767A1711BD5F6E7E4","old_key":"aLFBMWpxBrIDAD1Si/KVvm41"}'
                    let token = this.post('/App/Authentication/Device/signIn', request_key);
                    log(token)
                    setItem('token', token.token);
                    setItem('token_id', token.app_user_id);
                }
                if (!getMyVar('token_refresh', '')) {
                    let token_refresh = this.post('/App/Authentication/Authenticator/refresh');
                    log(token_refresh);
                    setItem('token', token_refresh.token);
                    setItem('token_id', token_refresh.app_user_id);
                    putMyVar('token_refresh', '1')
                }
                if (!storage0.getMyVar('NewDiscover')) {
                    let NewDiscover = this.post('/App/NewDiscover/getIndex');
                    storage0.putMyVar('NewDiscover', NewDiscover);
                }
                let NewDiscover = storage0.getMyVar('NewDiscover');
                let section = NewDiscover.section;
                let rank = NewDiscover.rank;
                section.forEach(item => {
                    d.push({
                        title: '‘‘' + item.name + '’’',
                        url: 'hiker://empty',
                        col_type: 'text_center_1',
                        extra: {
                            lineVisible: false,
                        },
                    });
                    let section_list = item.list;
                    section_list.forEach(item_1 => {
                        d.push({
                            title: this.color(item_1.name),
                            //img:item_1.pic,
                            img: 'hiker://images/icon_right5',
                            url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                                $.require('csdown').recommend()
                            }),
                            col_type: 'text_icon',
                            extra: {
                                lineVisible: false,
                                cate_id: item_1.cate_id,
                            }
                        })
                        item_1.list_vod.forEach(data => {
                            d.push({
                                title: data.name,
                                img: data.vod_pic,
                                url: $('hiker://empty?#immersiveTheme#').rule(() => {
                                    $.require('csdown').videoerji()
                                }),
                                col_type: 'movie_3',
                                extra: {
                                    vod_id: data.vod_id,
                                    t_id: data.t_id,
                                    vod_name: data.name,
                                }
                            })
                        })
                    })
                })
                rank.forEach(item => {
                    d.push({
                        title: '‘‘' + item.name + '’’',
                        url: 'hiker://empty',
                        col_type: 'text_center_1',
                        extra: {
                            lineVisible: false,
                        },
                    });
                    let rank_list = item.list;
                    rank_list.forEach(item_1 => {
                        d.push({
                            title: this.color(item_1.name),
                            //img:item_1.pic,
                            img: 'hiker://images/icon_right5',
                            url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                                $.require('csdown').recommend()
                            }),
                            col_type: 'text_icon',
                            extra: {
                                lineVisible: false,
                                cate_id: item_1.cate_id,
                            }
                        })
                        item_1.list_vod.forEach(data => {
                            d.push({
                                title: data.name,
                                img: data.vod_pic,
                                url: $('hiker://empty?#immersiveTheme#').rule(() => {
                                    $.require('csdown').videoerji()
                                }),
                                col_type: 'movie_3',
                                extra: {
                                    vod_id: data.vod_id,
                                    t_id: data.t_id,
                                    vod_name: data.name,
                                }
                            })
                        })
                    })
                })
            }
        } catch (e) {
            log(e.message)
        }
    },
    latestvideo: function() {
        var d = this.d;
        var d_ = this.d_;
        let pg = getParam('page');
        if (MY_PAGE == 1) {
            d_.push({
                img: 'https://seyouapp777.dzlndygh.com/i/2025/08/22/5e81d25c7176886d.png',
                url: 'hiker://empty',
                col_type: 'pic_1_full',
            })
            d_.push({
                img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                url: "hiker://empty",
                col_type: "pic_1_full",
                extra: {
                    id: "loading_"
                }
            });
            setPreResult(d_)
        }
        let latestvideo_body = '{"pageSize":"30","page":"' + pg + '"}';
        let latestvideo_list = this.post('/App/Index/latestVideo', latestvideo_body);
        latestvideo_list.forEach(data => {
            d.push({
                title: data.vod_name,
                desc: '今日正在更新：““' + data.vod_continu + '””  \n评分：““' + data.vod_scroe + '”” \n更新状态：““' + (data.is_end == true ? '已完结' : '未完结') + '””',
                img: data.vod_pic,
                url: $('hiker://empty?#immersiveTheme#').rule(() => {
                    $.require('csdown').videoerji();
                }),
                col_type: 'movie_1_vertical_pic',
                extra: {
                    vod_id: data.vod_id,
                    vod_name: data.vod_name,
                    lineVisible: false
                }
            })
        })
        deleteItem("loading_");
        setResult(d)
    },
    recommend: function() {
        var d = [];
        var d_ = this.d_;
        let id = MY_PARAMS.cate_id;
        let pg = getParam('page');
        if (MY_PAGE == 1) {
            d_.push({
                img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                url: "hiker://empty",
                col_type: "pic_1_full",
                extra: {
                    id: "loading_"
                }
            });
            setPreResult(d_)
            d.push({
                img: 'https://seyouapp777.dzlndygh.com/i/2025/08/22/5e81d25c7176886d.png',
                url: 'hiker://empty',
                col_type: 'pic_1_full',
            })
        }
        try {
            let body = '{"cateId":"' + id + '","pageSize":"20","page":"' + pg + '"}';
            let recommend = this.post('/App/NewDiscover/getList', body);
            if (MY_PAGE == 1) {
                d.push({
                    title: recommend.name,
                    desc: '查看更多+',
                    img: 'https://seyouapp777.dzlndygh.com/i/2025/08/29/1000069041.png',
                    url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                        $.require('csdown').subcatelist()
                    }),
                    col_type: 'avatar',
                    extra: {
                        cate_id: recommend.cate_id,
                        cate_name: recommend.name,
                    }
                })
            }
            recommend.list.forEach(data => {
                d.push({
                    title: data.title + '\n' + ('‘‘’’评分：' + data.score).small(),
                    desc: data.sub_title + '\n' + (/\.m3u8|\.mp4/.test(data.pre_video) ? '‘‘’’' + this.addressTag($('#noLoading#').b64().lazyRule((pre_video) => {
                        return pre_video;
                    }, data.pre_video), '点击查看预览视频') : ''),
                    img: data.pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        $.require('csdown').videoerji()
                    }),
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.title,
                        lineVisible: false
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        deleteItem("loading_");
        setResult(d)
    },
    subcatelist: function() {
        var d = this.d;
        var d_ = this.d_;
        let pg = getParam('page');
        let id = MY_PARAMS.cate_id;
        let name = MY_PARAMS.cate_name;
        if (MY_PAGE == 1) {
            d_.push({
                img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                url: "hiker://empty",
                col_type: "pic_1_full",
                extra: {
                    id: "loading_"
                }
            });
            setPreResult(d_)
            d.push({
                img: 'https://seyouapp777.dzlndygh.com/i/2025/08/22/5e81d25c7176886d.png',
                url: 'hiker://empty',
                col_type: 'pic_1_full',
            })
            d.push({
                title: name,
                img: 'https://seyouapp777.dzlndygh.com/i/2025/08/29/1000069041.png',
                url: 'hiker://empty',
                col_type: 'avatar',
                extra: {}
            })
        }
        try {
            let body = '{"cateId":"' + id + '","pageSize":"30","page":"' + pg + '"}';
            let subcatelist = this.post('/App/NewDiscover/getSubCateList', body).list;
            subcatelist.forEach(data => {
                d.push({
                    title: data.name,
                    url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                        $.require('csdown').subvodlist()
                    }),
                    col_type: 'text_2',
                    extra: {
                        cate_id: data.cate_id,
                        cate_name: data.name,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        deleteItem("loading_");
        setResult(d)
    },
    subvodlist: function() {
        var d = this.d;
        var d_ = this.d_;
        let pg = getParam('page');
        let id = MY_PARAMS.cate_id;
        let name = MY_PARAMS.cate_name;
        if (MY_PAGE == 1) {
            d_.push({
                img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                url: "hiker://empty",
                col_type: "pic_1_full",
                extra: {
                    id: "loading_"
                }
            });
            setPreResult(d_)
            d.push({
                img: 'https://seyouapp777.dzlndygh.com/i/2025/08/22/5e81d25c7176886d.png',
                url: 'hiker://empty',
                col_type: 'pic_1_full',
            })
            d.push({
                title: '‘‘' + name + '’’',
                url: 'hiker://empty',
                col_type: 'text_center_1',
                extra: {
                    lineVisible: false,
                }
            })
        }
        try {
            let body = '{"cateId":"' + id + '","pageSize":"30","page":"' + pg + '"}';
            let subvodlist = this.post('/App/NewDiscover/getSubVodList', body).list;
            subvodlist.forEach(data => {
                d.push({
                    title: data.vod_name,
                    desc: data.vod_score + ' ' + data.total,
                    img: data.vod_pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        $.require('csdown').videoerji()
                    }),
                    col_type: 'movie_3',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        deleteItem("loading_");
        setResult(d)
    },
    videoerji: function() {
        var d = this.d;
        addListener('onClose', $.toString(() => {
            clearMyVar('playinfo');
            clearMyVar('Vurl')
        }));
        let id = MY_PARAMS.vod_id;
        setPageTitle(MY_PARAMS.vod_name);
        try {
            if (!storage0.getMyVar('playinfo', '')) {
                let t = Math.floor(Date.now() / 1000) + '';
                let request_key = '{"token_id":"' + getItem('token_id') + '","vod_id":"' + id + '","mobile_time":"' + t + '","token":"' + getItem('token') + '"}'
                let playinfo = this.post('/App/IndexPlay/playInfo', request_key);
                storage0.putMyVar('playinfo', playinfo);
            }
            if (!storage0.getMyVar('Vurl')) {
                let request_key = '{"vurl_cloud_id":"2","vod_d_id":"' + id + '"}';
                let Vurl = this.post('/App/Resource/Vurl/show', request_key).list;
                storage0.putMyVar('Vurl', Vurl);
            }
            let playinfo = storage0.getMyVar('playinfo');
            let vod = playinfo.vodInfo;
            d.push({
                title: vod.vod_name + '\n' + ('‘‘’’演员：' + vod.vod_actor + '\n国家：' + vod.vod_area).small(),
                desc: '类型：' + vod.videoTag.join(' ') + '\n' + ('‘‘’’更新状态：' + vod.new_continue + '  ' + vod.vod_year),
                img: vod.vod_pic,
                url: $('hiker://empty?#gameTheme#').rule((pic, name, actor, videoTag, new_continue, area, vod_use_content, year) => {
                    var d = []
                    d.push({
                        img: pic,
                        url: pic + '#.jpg#',
                        col_type: 'pic_1_full'
                    }, {
                        title: '影片名：' + name,
                        col_type: 'rich_text'
                    }, {
                        title: '年代：' + year,
                        col_type: 'rich_text'
                    }, {
                        title: '演员：' + actor,
                        col_type: 'rich_text'
                    }, {
                        title: '类型：' + videoTag,
                        col_type: 'rich_text',
                    }, {
                        title: '更新状态：' + new_continue,
                        col_type: 'rich_text',
                    }, {
                        title: '国家：' + area,
                        col_type: 'rich_text',
                    }, {
                        title: '简介：' + vod_use_content,
                        col_type: 'rich_text',
                    }, )
                    setResult(d)
                }, vod.vod_pic, vod.vod_name, vod.vod_actor, vod.videoTag.join(' '), vod.new_continue, vod.vod_area, vod.vod_use_content, vod.vod_year),
                col_type: 'movie_1_vertical_pic_blur',
            })
            this.setDesc(d, vod.vod_use_content)
            d.push({
                title: (getMyVar('shsort', '0') == '1') ? '““””<b><span style="color: #FF0000">逆序</span></b>' : '““””<b><span style="color: #1aad19">正序</span></b>',
                url: $('#noLoading#').lazyRule(() => {
                    return $.require("csdown").shsort();
                }),
                col_type: 'text_center_1',
                extra: {
                    id: '排序',
                    //lineVisible:false,
                }
            })
            try {
                let urls = storage0.getMyVar('Vurl');
                if (getMyVar('shsort', '0') == '1') {
                    urls.reverse()
                }
                if (urls && urls.length == 0) {
                    d.push({
                        title: '影片下架或未上传，请选择其他影片观看',
                        url: 'hiker://empty',
                        col_type: 'text_center_1',
                        extra: {
                            lineVisible: false
                        }
                    })
                }
                let col = urls.length < 3 || urls[0].title.length > 5 ? 'text_2' : 'text_4'
                urls.forEach(data => {
                    d.push({
                        title: data.title,
                        url: $().lazyRule((id, vurl_id) => {
                            return $.require("csdown").jiexi(id, vurl_id)
                        }, id, data.id),
                        col_type: col,
                        extra: {
                            cls: '选集_',
                        }
                    })
                })
            } catch (e) {
                log(e.message)
            }
            d.push({
                col_type: 'blank_block',
                extra: {
                    id: 'blank',
                }
            }, {
                title: '<b><span style="color: #ff847c">推荐</span></b>',
                img: 'http://123.56.105.145/tubiao/messy/9.svg',
                url: $('#noLoading#').lazyRule(() => {
                    refreshPage(false)
                    return 'hiker://empty'
                }),
                col_type: 'text_icon',
                extra: {

                }
            })
            let recommendVod = playinfo.recommendVod;
            recommendVod.forEach(data => {
                d.push({
                    title: data.vod_name,
                    desc: data.new_continue,
                    img: data.vod_pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        if (MY_PARAMS.vod_id != getMyVar('vod_id_1')) {
                            clearMyVar('playinfo');
                            clearMyVar('Vurl')
                            putMyVar('vod_id_1', MY_PARAMS.vod_id)
                        }
                        $.require("csdown").videoerji();
                    }),
                    col_type: 'movie_3',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    search: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                d_.push({
                    img: 'https://seyouapp777.dzlndygh.com/i/2025/08/22/5e81d25c7176886d.png',
                    url: 'hiker://empty',
                    col_type: 'pic_1_full',
                })
                d_.push({   
                    title: "搜索 ",
                    url: $.toString(() => {
                        putMyVar('keyword', input)
                        refreshPage(false)
                        return "hiker://empty"
                    }),
                       desc: "请输入搜索关键词",
                       col_type: "input",
                    extra: {
                        defaultValue: getMyVar('keyword', ''),
                        pageTitle: '搜索结果'
                    }
                })
                d_.push({
                    img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                    url: "hiker://empty",
                    col_type: "pic_1_full",
                    extra: {
                        id: "loading_"
                    }
                });
                setPreResult(d_)
            }
            let body = JSON.stringify({
                'keywords': getMyVar('keyword'),
                'order_val': '1',
            })
            let list = this.post('/App/Index/findMoreVod', body).list;
            list.forEach(data => {
                d.push({
                    title: data.vod_name + '\n““””' + ('上映时间：' + data.vod_year + '\n地区：' + data.vod_area).small(),
                    desc: '评分：' + data.vod_scroe + '\n更新状态：' + data.new_continue + '\n演员：' + data.vod_actor,
                    img: data.vod_pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        $.require('csdown').videoerji();
                    }),
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                        lineVisible: false,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        deleteItem("loading_");
        setResult(d)
    },
    cate: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                if (!storage0.getItem('indexPid', '')) {
                    let indexPid = this.post('/App/Index/indexPid');
                    storage0.setItem('indexPid', indexPid);
                }
                let indexPid = storage0.getItem('indexPid');
                putMyVar('cate_t_id_index', indexPid[0].t_id);
                putMyVar('cate_pid_index', indexPid[0].pid);
                indexPid.forEach(data => {
                    d_.push({
                        title: getMyVar('cate_pid', getMyVar('cate_pid_index')) == data.pid ? this.strong(data.name, 'ff6699') : data.name,
                        url: $('#noLoading#').lazyRule((t_id, pid, name) => {
                            putMyVar('cate_t_id', t_id);
                            putMyVar('cate_pid', pid);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, data.t_id, data.pid, data.name),
                        col_type: 'scroll_button',
                        extra: {
                            backgroundColor: getMyVar('cate_pid', getMyVar('cate_pid_index')) == data.pid ? "#20FA7298" : "",
                            t_id: data.t_id,
                            pid: data.pid,
                        }
                    })
                })
                let cate_t_id = getMyVar('cate_t_id', getMyVar('cate_t_id_index'));
                let cate_pid = getMyVar('cate_pid', getMyVar('cate_pid_index'));
                if (!storage0.getMyVar('indexlist_' + cate_pid)) {
                    d_.push({
                        img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                        url: "hiker://empty",
                        col_type: "pic_1_full",
                        extra: {
                            id: "loading_"
                        }
                    });
                }
                setPreResult(d_);
                if (!storage0.getMyVar('banner_' + cate_pid)) {
                    let body = '{"pid":"' + cate_pid + '"}';
                    let banner = this.post('/App/Ad/bannerInfo', body).list;
                    let banner_ = [];
                    banner.forEach(data => {
                        if (!/游戏平台/.test(data.banner_content)) {
                            banner_.push({
                                vod_name: data.target_name,
                                vod_pic: data.slide_pic,
                                vod_id: data.vod_id,
                            })
                        }
                    })
                    storage0.putMyVar('banner_' + cate_pid, banner_);
                }
                this.banner(MY_RULE.title, true, d, storage0.getMyVar('banner_' + cate_pid), {
                    time: 5000,
                    col_type: 'card_pic_1',
                    desc: '0'
                });
                d.push({
                    title: this.color('更多分类'),
                    img: 'hiker://images/icon_right5',
                    url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                        $.require('csdown').cate_more()
                    }),
                    col_type: 'text_icon',
                    extra: {
                        t_id: cate_t_id,
                        lineVisible: false,
                    }
                })
                if (!storage0.getMyVar('cate_t_id_' + cate_t_id)) {
                    let body = '{"t_id":"' + cate_t_id + '"}'
                    let cate_t_id_list = this.post('/App/IndexList/indexScreen', body);
                    storage0.putMyVar('cate_t_id_' + cate_t_id, cate_t_id_list)
                }
                if (!storage0.getMyVar('indexlist_' + cate_pid)) {
                    let indexlist_body = '{"pid":"' + cate_pid + '"}';
                    let indexlist = this.post('/App/IndexList/index', indexlist_body).list;
                    storage0.putMyVar('indexlist_' + cate_pid, indexlist);
                }
                let indexlist = storage0.getMyVar('indexlist_' + cate_pid);
                indexlist.slice(0, 1).forEach(item => {
                    d.push({
                        title: this.color(item.type),
                        img: 'hiker://images/icon_right5',
                        url: $('hiker://empty?#gameTheme#').rule(() => {
                            $.require('csdown').cate_erji_1()
                        }),
                        col_type: 'text_icon',
                        extra: {
                            pid: item.pid,
                        },
                    })
                    item.list.forEach(data => {
                        d.push({
                            title: data.c_name,
                            desc: data.new_continue + '  ' + data.vod_douban_score,
                            img: data.c_pic,
                            url: $('hiker://empty?#immersiveTheme#').rule(() => {
                                $.require('csdown').videoerji();
                            }),
                            col_type: 'movie_2',
                            extra: {
                                vod_id: data.vod_id,
                                vod_name: data.c_name,
                            }
                        })
                    })
                })
                indexlist.slice(1).forEach(item => {
                    d.push({
                        title: this.color(item.type),
                        img: 'hiker://images/icon_right5',
                        url: $('hiker://empty?#gameTheme#').rule(() => {
                            $.require('csdown').cate_erji_2()
                        }),
                        col_type: 'text_icon',
                        extra: {
                            pid: item.pid,
                            type: item.type,
                            show_id: item.show_id,
                        },
                    })
                    item.list.forEach(data => {
                        d.push({
                            title: data.vod_name,
                            desc: data.new_continue + '  ' + data.vod_scroe,
                            img: data.vod_pic,
                            url: $('hiker://empty?#immersiveTheme#').rule(() => {
                                $.require('csdown').videoerji();
                            }),
                            col_type: 'movie_3',
                            extra: {
                                vod_id: data.vod_id,
                                vod_name: data.vod_name,
                            }
                        })
                    })
                })
            }
        } catch (e) {
            log(e.message)
        }
    },
    cate_more: function() {
        var d = this.d;
        var d_ = this.d_;
        let id = MY_PARAMS.t_id;
        let pg = getParam('page');
        let cate_t_id_list = storage0.getMyVar('cate_t_id_' + id);
        let fliter = ['column', 'area', 'year', 'sort'];
        if (MY_PAGE == 1) {
            d_.push({
                img: 'https://seyouapp777.dzlndygh.com/i/2025/08/22/5e81d25c7176886d.png',
                url: 'hiker://empty',
                col_type: 'pic_1_full',
            })
            fliter.forEach((item_1, index_1) => {
                if (cate_t_id_list[item_1] && cate_t_id_list[item_1].length > 0) {
                    putMyVar('cate_t_id_index_' + item_1, cate_t_id_list[item_1][0].value);
                    cate_t_id_list[item_1].forEach((data, index_2) => {
                        d_.push({
                            title: getMyVar('cate_t_id_' + item_1, getMyVar('cate_t_id_index_' + item_1)) == data.value ? this.strong(data.name, 'ff6699') : data.name,
                            url: $('#noLoading#').lazyRule((n, id, name) => {
                                putMyVar(n, id);
                                refreshPage(false);
                                return 'hiker://empty';
                            }, 'cate_t_id_' + item_1, data.value, data.name),
                            col_type: 'scroll_button',
                            extra: {
                                backgroundColor: getMyVar('cate_t_id_' + item_1, getMyVar('cate_t_id_index_' + item_1)) == data.value ? "#20FA7298" : "",
                            }
                        })
                    })
                }
                d_.push({
                    col_type: 'blank_block',
                    extra: {

                    }
                })
            })
            d_.push({
                img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                url: "hiker://empty",
                col_type: "pic_1_full",
                extra: {
                    id: "loading_"
                }
            });
            setPreResult(d_)
        }
        let index_list_body = {};
        fliter.forEach((item_1, index_1) => {
            if (cate_t_id_list[item_1] && cate_t_id_list[item_1].length > 0) {
                index_list_body[item_1.replace('column', 'tid')] = getMyVar('cate_t_id_' + item_1, getMyVar('cate_t_id_index_' + item_1));
            } else if (item_1 == 'column') {
                index_list_body['tid'] = id;
            }
        })
        index_list_body.page = pg + '';
        index_list_body.pageSize = '30';
        let index_list = this.post('/App/IndexList/indexList', JSON.stringify(index_list_body)).list;
        index_list.forEach(data => {
            d.push({
                title: data.vod_name,
                desc: data.new_continue + '  ' + data.vod_scroe,
                img: data.vod_pic,
                url: $('hiker://empty?#immersiveTheme#').rule(() => {
                    $.require('csdown').videoerji();
                }),
                col_type: 'movie_3',
                extra: {
                    vod_id: data.vod_id,
                    vod_name: data.vod_name,
                }
            })
        })
        deleteItem("loading_");
        setResult(d)
    },
    cate_erji_1: function() {
        var d = this.d;
        var d_ = this.d_;
        let id = MY_PARAMS.pid;
        d_.push({
            img: 'https://seyouapp777.dzlndygh.com/i/2025/08/22/5e81d25c7176886d.png',
            url: 'hiker://empty',
            col_type: 'pic_1_full',
        })
        d_.push({
            img: "http://123.56.105.145/weisyr/img/Loading1.gif",
            url: "hiker://empty",
            col_type: "pic_1_full",
            extra: {
                id: "loading_"
            }
        });
        setPreResult(d_)
        let cate_erji_body = '{"pid":"' + id + '"}';
        let cate_erji_list = this.post('/App/IndexList/choiceList', cate_erji_body).list;
        cate_erji_list.forEach(data => {
            d.push({
                title: data.c_name,
                desc: data.new_continue + '  ' + data.vod_douban_score,
                img: data.c_pic,
                url: $('hiker://empty?#immersiveTheme#').rule(() => {
                    $.require('csdown').videoerji();
                }),
                col_type: 'movie_2',
                extra: {
                    vod_id: data.vod_id,
                    vod_name: data.c_name,
                }
            })
        })
        deleteItem("loading_");
        setResult(d)
    },
    cate_erji_2: function() {
        var d = this.d;
        var d_ = this.d_;
        let pid = MY_PARAMS.pid;
        let show_id = MY_PARAMS.show_id;
        d_.push({
            img: 'https://seyouapp777.dzlndygh.com/i/2025/08/22/5e81d25c7176886d.png',
            url: 'hiker://empty',
            col_type: 'pic_1_full',
        })
        d_.push({
            img: "http://123.56.105.145/weisyr/img/Loading1.gif",
            url: "hiker://empty",
            col_type: "pic_1_full",
            extra: {
                id: "loading_"
            }
        });
        setPreResult(d_)
        let cate_erji_body = '{"show_id":"' + show_id + '","pid":"' + pid + '"}';
        let cate_erji_list = this.post('/App/IndexList/hotsList', cate_erji_body).list;
        cate_erji_list.forEach(data => {
            d.push({
                title: data.vod_name,
                desc: data.new_continue + '  ' + data.vod_scroe,
                img: data.vod_pic,
                url: $('hiker://empty?#immersiveTheme#').rule(() => {
                    $.require('csdown').videoerji();
                }),
                col_type: 'movie_3',
                extra: {
                    vod_id: data.vod_id,
                    vod_name: data.vod_name,
                }
            })
        })
        deleteItem("loading_");
        setResult(d)
    },
    microvod: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = getParam('page');
        let microvod;
        try {
            if (MY_PAGE == 1) {
                if (!storage0.getItem('cate_microvod')) {
                    let cate_microvod = this.post('/App/Resource/Vod/microVodTab').list;
                    storage0.setItem('cate_microvod', cate_microvod)
                }
                let cate_microvod = storage0.getItem('cate_microvod');
                putMyVar('microvod_index', cate_microvod[0].id);
                microvod = getMyVar('microvod', getMyVar('microvod_index'));
                cate_microvod.forEach(data => {
                    d_.push({
                        title: microvod == data.id ? this.strong(data.module_name, 'ff6699') : data.module_name,
                        url: $('#noLoading#').lazyRule((n, id, name) => {
                            putMyVar(n, id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, 'microvod', data.id, data.module_name),
                        col_type: 'scroll_button',
                        extra: {
                            cate_id: data.id,
                            backgroundColor: microvod == data.id ? "#20FA7298" : "",
                        }
                    })
                })
                if (!storage0.getMyVar('microvod_' + microvod + pg)) {
                    d_.push({
                        col_type: 'blank_block',
                        extra: {
                            id: 'blank_3',
                        }
                    }, {
                        img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                        url: "hiker://empty",
                        col_type: "pic_1_full",
                        extra: {
                            id: "loading_"
                        }
                    });
                }
                setPreResult(d_)
            }
            microvod = getMyVar('microvod', getMyVar('microvod_index'));
            if (!storage0.getMyVar('microvod_' + microvod + pg)) {
                let microvod_body = '{"pageSize":"20","pid":"' + microvod + '","page":"' + pg + '"}';
                let microvod_list = this.post('/App/Resource/Vod/microVodList', microvod_body).list;
                storage0.putMyVar('microvod_' + microvod + pg, microvod_list)
            }
            let microvod_list = storage0.getMyVar('microvod_' + microvod + pg);
            microvod_list.forEach(data => {
                d.push({
                    title: data.name,
                    desc: '““””' + this.addressTag($('hiker://empty?#immersiveTheme#').b64().rule(() => {
                        $.require('csdown').videoerji();
                    }), '点此观看全集') + '\n' + data.detail_info,
                    img: 'https://seyouapp777.dzlndygh.com/i/2025/08/29/1000069041.png',
                    //img:data.pic_url,
                    url: data.default_play_url,
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        lineVisible: false,
                        vod_id: data.related_id || data.vod_id,
                        vod_name: data.name,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
    },
    jiexi: function(id, vurl_id) {
        try {
            let names = ['1080', '720'];
            urls = names.map(data => {
                let request_key = '{"domain_type":"8","vod_id":"' + id + '","type":"play","resolution":"' + data + '","vurl_id":"' + vurl_id + '"}';
                let line_url = this.post('/App/Resource/VurlDetail/showOne', request_key).url;
                return line_url;
            })
            return {
                urls: urls,
                names: names
            }
        } catch (e) {
            log(e.message)
            return 'toast://未获取到链接'
        }
    },
    shsort: function() {
        putMyVar('shsort', getMyVar('shsort') == '1' ? '0' : '1')
        try {
            let urls = findItemsByCls("选集_");
            urls.reverse();
            urls.forEach(item => {
                item.col_type = item.type;
            });
            updateItem('排序', {
                title: (getMyVar('shsort', '0') == '1') ? '““””<b><span style="color: #FF0000">逆序</span></b>' : '““””<b><span style="color: #1aad19">正序</span></b>',
            })
            deleteItemByCls('选集_');
            addItemBefore('blank', urls);
            toast('切换排序成功');
        } catch (e) {
            refreshPage(false)
        }
        return 'hiker://empty';
    },
}
$.exports = csdown
