//
// description:		module offers local logging in indexedDB
// author:			Leibniz-Institut für Wissensmedien Tübingen, Andre Klemke
//

export default class LocalLogger {
    constructor() {
        this.db = null
        this.dbrequest = null
        //window.iwmstudy.logger = this;
    }

    init() {
        this.dbrequest = indexedDB.open('iwmstudy', 1)
        this.dbrequest.addEventListener(
            'upgradeneeded',
            this.dbUpdateNeeded.bind(this)
        )
        this.dbrequest.addEventListener('success', this.dbOpened.bind(this))
        this.dbrequest.addEventListener('error', console.log('error:',this.dbrequest.error))
    }

    dbUpdateNeeded(event) {
        // event for db creation or modification
        console.log('local DB created or modified')
        this.db = this.dbrequest.result
        if (!this.db.objectStoreNames.contains('pagevisit')) {
            let store = this.db.createObjectStore('pagevisit', {
                keyPath: 'key',
                autoIncrement: true
            })
            store.createIndex(
                'pagevisit_index1',
                ['studyid', 'runid', 'userid', 'pagecounter', 'pageid'],
                {unique: false}
            )
            store.createIndex(
                'pagevisit_index2',
                ['studyid', 'runid', 'userid', 'dataavailable'],
                {unique: false}
            )
            store.createIndex(
                'pagevisit_index3',
                ['studyid', 'dataavailable'],
                {unique: false}
            )
            store.createIndex(
                'pagevisit_index4',
                ['studyid', 'runid', 'userid', 'pageid'],
                {unique: false}
            )
        }
        if (!this.db.objectStoreNames.contains('run')) {
            let store = this.db.createObjectStore('run', {
                keyPath: 'key',
                autoIncrement: true
            })
            store.createIndex('run_index1', 'studyid', {unique: false})
        }
        if (!this.db.objectStoreNames.contains('user')) {
            let store = this.db.createObjectStore('user', {
                keyPath: 'key',
                autoIncrement: true
            })
            store.createIndex('user_index1', 'userid', {unique: false})
        }
        if (!this.db.objectStoreNames.contains('message')) {
            let store = this.db.createObjectStore('message', {
                keyPath: 'key',
                autoIncrement: true
            })
        }
        if (!this.db.objectStoreNames.contains('log')) {
            let store = this.db.createObjectStore('log', {
                keyPath: 'key',
                autoIncrement: true
            })
            store.createIndex('log_index1', 'studyid', {unique: false})
            store.createIndex('log_index2', ['studyid', 'timestamp'], {
                unique: false
            })
        }
        if (!this.db.objectStoreNames.contains('loganonymous')) {
            let store = this.db.createObjectStore('loganonymous', {
                keyPath: 'key',
                autoIncrement: true
            })
        }
    }

    dbOpened(event) {
        console.log('local DB openend')
        this.db = this.dbrequest.result
    }

    getPagevisitData(studyid, runid, userid, pageid, formid, callback) {
        console.log(`get pagevisit data ${pageid} ${formid}`)
        let trans = this.db.transaction(['pagevisit'], 'readonly')
        let store = trans.objectStore('pagevisit')
        let index = store.index('pagevisit_index4')
        let request = index.openCursor(
            IDBKeyRange.only([studyid, runid, userid, pageid])
        )
        let formvalue
        let relatedpagecounter = 0
        request.onsuccess = function(evt) {
            let cursor = evt.target.result
            if (cursor) {
                if (cursor.value.pagecounter > relatedpagecounter) {
                    relatedpagecounter = cursor.value.pagecounter
                    formvalue = null
                    if (cursor.value.dataavailable == 1) {
                        if (cursor.value.data.hasOwnProperty(formid)) {
                            formvalue = cursor.value.data[formid]
                        }
                    }
                }
                cursor.continue()
            } else {
                //self only implemented
                callback(`self.${pageid}.${formid}`, formvalue)
            }
        }
    }

    createRun(studyid, conditionid, neededuser, userid, expversion) {
        console.log(
            `creating run for user ${userid} with condition ${conditionid}`
        )
        let lastrunid = 0
        let trans = this.db.transaction(['run'], 'readonly')
        let store = trans.objectStore('run')
        let index = store.index('run_index1')
        let request = index.openCursor(IDBKeyRange.only(studyid))
        request.onsuccess = function(evt) {
            let cursor = evt.target.result
            if (cursor) {
                if (cursor.value.runid > lastrunid) {
                    lastrunid = cursor.value.runid
                }
                cursor.continue()
            } else {
                let dbitem = {
                    studyid: studyid,
                    runid: lastrunid + 1,
                    conditionid: conditionid,
                    expversion: expversion,
                    neededuser: neededuser,
                    currentuser: [userid],
                    currentpage: null,
                    pagehistory: null,
                    pagemetadata: null,
                    pagegroupmetadata: null,
                    runtimedata: null
                }
                let trans = iwmstudy.logger.db.transaction(['run'], 'readwrite')
                let store = trans.objectStore('run')
                let request = store.put(dbitem)
                request.onsuccess = function(evt) {
                    console.log(`run created`)
                    let event = new CustomEvent('runready', {
                        detail: {runid: lastrunid + 1}
                    })
                    window.dispatchEvent(event)
                }
            }
        }
    }

    createMessage(studyid, runid, target, source, mode, type, data) {}

    notifyForAddedUser(studyid, runid) {}

    checkMessages(studyid, runid, user) {}

    getRun(studyid, runid) {}

    getRunUser(studyid, runid) {}

    getOpenRun(studyid) {
        console.log('check for open run')
        let event = new CustomEvent('openrunresult', {
            detail: {runfound: false, runid: '0', condition: '', neededuser: 1}
        })
        window.dispatchEvent(event)
    }

    getExistingOwnRun(studyid, userid) {}

    addUserToRun(studyid, runid, userid) {
        console.log(`adding user ${userid} to run ${runid}`)
        let event = new CustomEvent('runready', {detail: {runid: runid}})
        window.dispatchEvent(event)
    }

    userSynced(studyid, runid, syncid) {}

    getUserRole(userid, password, study) {}

    getHash(datastring) {
        let bitArray = sjcl.hash.sha256.hash(datastring)
        let digest_sha256 = sjcl.codec.hex.fromBits(bitArray)
        return digest_sha256
    }

    registerUser(userid, password, email, study, role) {
        console.log('registerUser')
        let trans = this.db.transaction(['user'], 'readonly')
        let store = trans.objectStore('user')
        let index = store.index('user_index1')
        let request = index.openCursor(IDBKeyRange.only(userid))
        request.onsuccess = function(evt) {
            let cursor = evt.target.result
            if (cursor) {
                console.log(`userid already exists`)
                let event = new CustomEvent('userregistrationfailed', {
                    detail: {cause: 'exists'}
                })
                window.dispatchEvent(event)
            } else {
                let roles = {}
                roles[study] = role
                let dbitem = {
                    userid: userid,
                    passwordhash: iwmstudy.logger.getHash(password),
                    email: email,
                    roles: roles
                }
                let trans = iwmstudy.logger.db.transaction(
                    ['user'],
                    'readwrite'
                )
                let store = trans.objectStore('user')
                let request = store.put(dbitem)
                request.onsuccess = function(evt) {
                    console.log(`user created`)
                    let event = new CustomEvent('userregistrationsucceeded', {
                        detail: null
                    })
                    window.dispatchEvent(event)
                }
            }
        }
    }

    checkUserLogin(userid, password, study) {}

    addStudyToUser(userid, study, role) {}

    getLastPagecounter(studyid, runid, userid) {}

    pageEntered(
        studyid,
        runid,
        userid,
        pagecounter,
        pageid,
        syncid,
        timestamp,
        pagehistory
    ) {
        let dbitem = {
            studyid: studyid,
            runid: runid,
            userid: userid,
            pagecounter: pagecounter,
            pageid: pageid,
            syncid: syncid,
            starttime: timestamp,
            endtime: null,
            data: null,
            dataavailable: 0
        }
        let trans = this.db.transaction(['pagevisit'], 'readwrite')
        let store = trans.objectStore('pagevisit')
        let request = store.put(dbitem)
        request.onsuccess = function(evt) {
            console.log(`logged page ${pageid} entered`)
        }
    }

    pageLeft(
        studyid,
        runid,
        userid,
        pagecounter,
        pageid,
        timestamp,
        data,
        pagemetadata,
        pagegroupmetadata,
        runtimedatachanged,
        runtimedata
    ) {
        let trans = this.db.transaction(['pagevisit'], 'readwrite')
        let store = trans.objectStore('pagevisit')
        let index = store.index('pagevisit_index1')
        let request = index.openCursor(
            IDBKeyRange.only([studyid, runid, userid, pagecounter, pageid])
        )
        request.onsuccess = function(evt) {
            let cursor = evt.target.result
            if (cursor) {
                //fuer alle passenden Datensaetze (hier nur einer)
                console.log(`logging ${pageid} pagedata`)
                let item = cursor.value
                item.endtime = timestamp
                item.data = data
                if (Object.keys(data).length > 0) {
                    item.dataavailable = 1
                }
                let request2 = cursor.update(item)
                request2.onsuccess = function() {
                    console.log(`logging successfull ${pageid} ${data}`)
                }
                cursor.continue()
            }
        }
    }

    logAction(
        studyid,
        runid,
        userid,
        pagecounter,
        pageid,
        timestamp,
        elapsedtime,
        action,
        data
    ) {
        if (this.db === null) {
            console.warn('logAction db is null: Fix this error')
            return
        }
        let dbitem = {
            studyid: studyid,
            runid: runid,
            userid: userid,
            pagecounter: pagecounter,
            pageid: pageid,
            timestamp: timestamp,
            elapsedtime: elapsedtime,
            action: action,
            data: data
        }
        let trans = this.db.transaction(['log'], 'readwrite')
        let store = trans.objectStore('log')
        let request = store.put(dbitem)
        request.onsuccess = function(evt) {
            console.log(`logged action ${action}`)
        }
        //console.log(dbitem)
    }

    loganonymous(studyid, anonymousrunid, pageid, type, value) {}

    getAllRunData(studyid) {}
}
