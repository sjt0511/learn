// 引入的不再是 Vue 构造函数，引入的是一个名为 createApp 的工厂函数
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import store from './store'

import './utils/init' // 初始化

import './styles/index.scss'
// import './styles2/index.less'

createApp(App).use(router).use(store).use(createPinia()).mount('#app')
// 拆分写法
// // 创建应用实例对象--app(类似于 Vue2 中的 vm，但 app 比 vm 更“轻”)
// const app = createApp(App)
// // 挂载应用实例对象
// app.mount('#app')

// Vue2 写法
// new Vue({
//     render: h => h(App)
// }).$mount('#app')



// const json = {
// 	"articleHost": null,
// 	"frontConfig": false,
// 	"testMode": false,
// 	"activeAnimate": true,
// 	"hospital": {
// 		"logo": "",
// 		"name": "Äþ²¨ÊÐµÚÒ»Ò½Ôº",
// 		"introduction": "",
// 		"floor": ""
// 	},
// 	"time": {
// 		"startStep": 3000,
// 		"back": 120,
// 		"finalStep": 8,
// 		"windows": 120,
// 		"confirm": 60,
// 		"refresh": 1000
// 	},
// 	"home": {
// 		"hideNf": false,
// 		"scale": null,
// 		"page": {
// 			"name": null
// 		},
// 		"apps": [],
// 		"modules": [{
// 			"name": "recognition",
// 			"img": "",
// 			"type": "signLis",
// 			"types": [],
// 			"pics": [""],
// 			"text": "³éÑªÈ¡ºÅ",
// 			"app": "",
// 			"title": null,
// 			"hidden": false,
// 			"size": "L",
// 			"texts": []
// 		}, {
// 			"name": "tip",
// 			"img": null,
// 			"type": "",
// 			"types": [],
// 			"pics": [],
// 			"text": "²ÉÑªÇ°ÇëÏÈ½øÐÐÇ©µ½",
// 			"app": "",
// 			"title": "",
// 			"hidden": false,
// 			"size": "",
// 			"texts": []
// 		}],
// 		"margin": 0,
// 		"banners": []
// 	},
// 	"login": {
// 		"type": {
// 			"face": false,
// 			"face_credit": false,
// 			"face_nonLocal": false,
// 			"face_mode": "two",
// 			"idNo": false,
// 			"scan": true,
// 			"input": false,
// 			"credit": false,
// 			"face_register": false,
// 			"dzybpz": true
// 		},
// 		"cards": [{
// 			"type": "cha",
// 			"img": "card_jkk.png",
// 			"tip": null,
// 			"help": ["help_jkk_bg.png"],
// 			"text": "½¡¿µ¿¨",
// 			"text2": null,
// 			"disabled": []
// 		}, {
// 			"type": "tm",
// 			"img": "Zlb.png",
// 			"tip": "µç×Ó½¡¿µ¿¨¡¢µç×ÓÒ½±£¿¨",
// 			"help": ["help_dzjkk_bg.png"],
// 			"text": "µç×Ó¶þÎ¬Âë",
// 			"text2": null,
// 			"disabled": []
// 		}, {
// 			"type": "cha",
// 			"img": "card_sbk.png",
// 			"tip": null,
// 			"help": ["help_sbk_bg.png"],
// 			"text": "²å¿¨Ç©µ½",
// 			"text2": null,
// 			"disabled": []
// 		}],
// 		"manual": false
// 	},
// 	"pay": {
// 		"show": {
// 			"round": true,
// 			"hideDone": false
// 		},
// 		"jump": false,
// 		"type": {
// 			"qr": true,
// 			"qr_icbc": false,
// 			"qr_zfb": false,
// 			"qr_wx": false,
// 			"credit": false,
// 			"inside": false,
// 			"face": false,
// 			"face_jt": false,
// 			"nfCredit": false
// 		},
// 		"time": {
// 			"register": true,
// 			"appointment": false
// 		}
// 	},
// 	"sign": {
// 		"register": true,
// 		"getTicket": true,
// 		"mode": "znfz",
// 		"type": "",
// 		"docNumber": "normal",
// 		"singleDNId": false
// 	},
// 	"print": {
// 		"active": ["lis", "pacs", "mzbl"],
// 		"barcode": [],
// 		"spl": [],
// 		"showList": false,
// 		"autoExit": false,
// 		"spl_emr": true
// 	},
// 	"register": {
// 		"jump": false,
// 		"tb": true,
// 		"notice": "",
// 		"notice_nucleic": "",
// 		"nucleic_notice": "",
// 		"nucleic_questions": "",
// 		"time_stopExpert": "",
// 		"type": {
// 			"doctor": false,
// 			"expert": false,
// 			"emergency": false
// 		},
// 		"area_startTime": false,
// 		"apt_choose_expert": false,
// 		"fever": [],
// 		"nucleic_questionnaire_id": 1
// 	},
// 	"hosPay": {
// 		"hidePre": false,
// 		"hideSettle": false,
// 		"numberLogin": false
// 	},
// 	"accompany": {
// 		"temp": true,
// 		"url": "http://brzy.nbdeyy.com:9688/careh5/#/care/care_list/",
// 		"host": "http://brzy.nbdeyy.com:9688",
// 		"escortMax": 2,
// 		"introduce": "ÕâÀïÊÇÎªÊ²Ã´ÐèÒª×¡ÔºÅã»¤Âë£¿µÄ½éÉÜ",
// 		"qr": "ticket01.png",
// 		"gzh": "Äþ²¨µÚ¶þÒ½Ôº",
// 		"guide1": "acommpany1.png",
// 		"guide2": "acommpany2.png",
// 		"time": "1",
// 		"orgId": 0
// 	},
// 	"others": {
// 		"records": [""],
// 		"gzh": ""
// 	},
// 	"yzs": {
// 		"host": "",
// 		"gr_id": "",
// 		"gr_secret": "",
// 		"host_myd": "",
// 		"id_myd": "",
// 		"secret_myd": ""
// 	},
// 	"micro": {
// 		"host": "",
// 		"api": ""
// 	},
// 	"nucleic": {
// 		"notice": ""
// 	}
// }